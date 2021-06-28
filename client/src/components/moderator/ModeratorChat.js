import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { connect } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import Tooltip from "@material-ui/core/Tooltip";
import FoldingCube from "../FoldingCube";

import Cookies from "universal-cookie";

/* Icons */
import TelegramIcon from "@material-ui/icons/Telegram";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReplayIcon from "@material-ui/icons/Replay";
import io from "socket.io-client";
import CircularProgress from "@material-ui/core/CircularProgress";

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/";

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

  return (
    <div className={"messageContainer " + deletedClassName}>
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
      <span className="messageUser" style={{ color: "#b0281c" }}>
        {user}
      </span>
      <span className="messageText">{ReactEmoji.emojify(text)}</span>
    </div>
  );
};

const Input = ({ setMessage, sendMessage, message, theme, sendLoading }) => (
  <form className="form chat-input-container">
    <input
      className="chat-input"
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
  const [chatHidden, setChatHidden] = useState(false);
  const [isInitialConnect, setIsInitialConnect] = useState(true);
  const [socket, setSocket] = useState(null);
  const connectRef = useRef();

  // set a reference to isInitialConnect so we can access it from inside the on connect callback
  connectRef.current = isInitialConnect;

  useEffect(() => {
    const _socket = io(ENDPOINT, {
      path: "/api/socket/chat",
      transports: ["websocket", "polling"],
      rejectUnauthorized: false,
    });

    _socket.on("connect", () => {
      console.log("Connected to socket");

      // join room
      // Or if reconnecting, rejoin the room with the flag isInitialConnect = false
      _socket.emit(
        "join",
        { userId, room, isInitialConnect: connectRef.current },
        (id) => {
          // If it's the initial connection, set the chat user id
          if (connectRef.current) setChatUserId(id);
          // Joined at least once, so set the isInititalConnect to false
          setIsInitialConnect(false);
        }
      );
    });
    _socket.on("connect_error", (error) => {
      setMessages((messages) => [
        ...messages,
        { text: error, isNotification: true },
      ]);
    });

    _socket.on("error", (error) => {
      setMessages((messages) => [
        ...messages,
        { text: error, isNotification: true },
      ]);
    });

    _socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    // receive multiple messages at once (i.e. full history when joining a room)
    _socket.on("bulkMessage", (bulkMessages) => {
      setMessages((messages) => [...messages, ...bulkMessages]);
    });

    _socket.on("notification", (message) => {
      setMessages((messages) => [
        ...messages,
        { ...message, isNotification: true },
      ]);
    });

    _socket.on("delete", (id) => {
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

    _socket.on("restore", (id) => {
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

    _socket.on("chatHidden", (chatHidden) => {
      setChatHidden(chatHidden);
    });

    _socket.on("deleteAll", () => {
      setMessages((messages) =>
        messages.map((msg) => {
          return { ...msg, deleted: true };
        })
      );
    });

    _socket.on("refresh", () => {
      setMessages([]);
    });

    setSocket(_socket);
  }, []);

  // code below pulls in functions from messaging for moderator actions
  useImperativeHandle(ref, () => ({
    deleteAllMessages() {
      socket.emit("deleteAllMessages", { room });
    },
    updateChatHidden(chatHidden) {
      socket.emit("setChatHidden", { chatHidden, room });
    },
    refreshChat() {
      socket.emit("refreshChat", { room });
    },
    getChatHistory() {
      return messages;
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
            chatHidden
              ? "moderator-chat-header  grey"
              : "moderator-chat-header "
          }
        >
          Chat {chatHidden ? "(Hidden)" : ""}
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
