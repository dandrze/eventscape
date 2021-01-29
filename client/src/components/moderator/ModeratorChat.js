import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { connect } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Cookies from "universal-cookie";

/* Icons */
import TelegramIcon from "@material-ui/icons/Telegram";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReplayIcon from "@material-ui/icons/Replay";
import io from "socket.io-client";

const ENDPOINT =
  window.location.hostname.split(".")[
    window.location.hostname.split(".").length - 1
  ] === "localhost"
    ? "http://localhost:5000/"
    : "https://eventscape.io/";

let socket;

const Messages = ({
  messages,
  chatUserId,
  isModerator,
  deleteMessage,
  restoreMessage,
}) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message
          message={message}
          chatUserId={chatUserId}
          isModerator={isModerator}
          deleteMessage={deleteMessage}
          restoreMessage={restoreMessage}
        />
      </div>
    ))}
  </ScrollToBottom>
);

const Message = ({
  message: { text, user, userId, id, deleted, isNotification },
  chatUserId,
  deleteMessage,
  restoreMessage,
}) => {
  let isSentByCurrentUser = false;

  if (userId === chatUserId) {
    isSentByCurrentUser = true;
  }

  if (isNotification) {
    return <p className="sentText justifyCenter ">{text}</p>;
  }

  const deletedClassName = deleted ? "deleted-message" : null;

  return isSentByCurrentUser ? (
    <div className={"messageContainer justifyEnd " + deletedClassName}>
      <p className="sentText pr-10">{user}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
      {/* Moderator Controls */}
      {deleted ? (
        <Tooltip title="Restore chat message" className="delete-chat-message">
          <ReplayIcon onClick={() => restoreMessage(id)} />
        </Tooltip>
      ) : (
        <Tooltip title="Delete chat message" className="delete-chat-message">
          <DeleteOutlineIcon onClick={() => deleteMessage(id)} />
        </Tooltip>
      )}
    </div>
  ) : (
    <div className={"messageContainer justifyStart " + deletedClassName}>
      {/* Moderator Controls */}
      {deleted ? (
        <Tooltip title="Restore chat message" className="delete-chat-message">
          <ReplayIcon onClick={() => restoreMessage(id)} />
        </Tooltip>
      ) : (
        <Tooltip title="Delete chat message" className="delete-chat-message">
          <DeleteOutlineIcon onClick={() => deleteMessage(id)} />
        </Tooltip>
      )}
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

const Input = ({ setMessage, sendMessage, message, theme, sendLoading }) => (
  <form className="form">
    <input
      className="input width-80"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
      disabled={sendLoading}
    />
    {sendLoading ? (
      <CircularProgress style={{ margin: "auto" }} />
    ) : (
      <button
        className="theme-button send-button width-20"
        style={theme}
        onClick={(e) => sendMessage(e)}
      >
        <TelegramIcon />
      </button>
    )}
  </form>
);

const ModeratorChat = forwardRef(({ room, userId }, ref) => {
  const [chatUserId, setChatUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT, {
      path: "/api/socket/chat",
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log("Connected to socket");
    });
    socket.on("connect_error", (error) => {
      setMessages((messages) => [
        ...messages,
        { text: error, isNotification: true },
      ]);
    });

    socket.on("error", (error) => {
      setMessages((messages) => [
        ...messages,
        { text: error, isNotification: true },
      ]);
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("notification", (message) => {
      setMessages((messages) => [
        ...messages,
        { ...message, isNotification: true },
      ]);
    });

    socket.on("delete", (id) => {
      //map through the messages array and add the deleted flag to the message with the target id
      setMessages((messages) =>
        messages.map((msg) => {
          if (msg.id == id) {
            return { ...msg, deleted: true };
          } else {
            return msg;
          }
        })
      );
    });

    socket.on("restore", (id) => {
      //map through the messages array and add the deleted flag to the message with the target id
      setMessages((messages) =>
        messages.map((msg) => {
          if (msg.id == id) {
            return { ...msg, deleted: false };
          } else {
            return msg;
          }
        })
      );
    });

    socket.on("chatHidden", (isHidden) => {
      setIsHidden(isHidden);
    });

    socket.on("deleteAll", () => {
      setMessages((messages) =>
        messages.map((msg) => {
          return { ...msg, deleted: true };
        })
      );
    });

    socket.on("refresh", () => {
      console.log("chat refreshed");
      setMessages([]);
    });

    socket.emit("join", { userId, room }, (id) => {
      setChatUserId(id);
    });
  }, []);

  // code below pulls in functions from messaging for moderator actions
  useImperativeHandle(ref, () => ({
    deleteAllMessages() {
      socket.emit("deleteAllMessages", { room });
    },
    setIsHidden(isHidden) {
      socket.emit("setChatHidden", { isHidden, room });
    },
    refreshChat() {
      socket.emit("refreshChat", { room });
    },
  }));

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      setSendLoading(true);
      socket.emit("sendMessage", { chatUserId, room, message }, () => {
        setMessage("");
        setSendLoading(false);
      });
    }
  };

  const deleteMessage = (id) => {
    socket.emit("deleteMessage", { id, room });
  };

  const restoreMessage = (id) => {
    socket.emit("restoreMessage", { id, room });
  };

  return (
    <div className="chatOuterContainer">
      <div className="chatContainer">
        <div
          className={
            isHidden
              ? "infoBar moderator-questions-header grey"
              : "infoBar moderator-questions-header"
          }
        >
          Chat {isHidden ? "(Hidden)" : ""}
        </div>
        <Messages
          messages={messages}
          chatUserId={chatUserId}
          deleteMessage={deleteMessage}
          restoreMessage={restoreMessage}
        />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          sendLoading={sendLoading}
        />
      </div>
    </div>
  );
});

export default ModeratorChat;
