import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";

/* Icons */
import TelegramIcon from "@material-ui/icons/Telegram";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReplayIcon from "@material-ui/icons/Replay";
import ChatWhiteIcon from "../icons/chat-white.svg";

/* Code based on the following tutorial: 
https://www.youtube.com/watch?v=ZwFA3YMfkoc
https://github.com/adrianhajdin/project_chat_application
*/

import queryString from "query-string";
import io from "socket.io-client";

import "./chat4.css";

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
  isModerator,
  deleteMessage,
  restoreMessage,
}) => {
  let isSentByCurrentUser = false;

  if (userId === chatUserId) {
    isSentByCurrentUser = true;
  }

  if (deleted && !isModerator) {
    // if the message is deleted and it is not the moderator, don't show the message
    return null;
  }

  if (isNotification) {
    return <p className="sentText justifyCenter ">{text}</p>;
  }

  const deletedClassName = isModerator && deleted ? "deleted-message" : null;

  return isSentByCurrentUser ? (
    <div className={"messageContainer justifyEnd " + deletedClassName}>
      <p className="sentText pr-10">{user}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>

      {/* Moderator Controls */}
      {isModerator &&
        (deleted ? (
          <Tooltip title="Restore chat message" className="delete-chat-message">
            <ReplayIcon onClick={() => restoreMessage(id)} />
          </Tooltip>
        ) : (
          <Tooltip title="Delete chat message" className="delete-chat-message">
            <DeleteOutlineIcon onClick={() => deleteMessage(id)} />
          </Tooltip>
        ))}
    </div>
  ) : (
    <div className={"messageContainer justifyStart " + deletedClassName}>
      {/* Moderator Controls */}
      {isModerator &&
        (deleted ? (
          <Tooltip title="Restore chat message" className="delete-chat-message">
            <ReplayIcon onClick={() => restoreMessage(id)} />
          </Tooltip>
        ) : (
          <Tooltip title="Delete chat message" className="delete-chat-message">
            <DeleteOutlineIcon onClick={() => deleteMessage(id)} />
          </Tooltip>
        ))}

      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

const Input = ({ setMessage, sendMessage, message, theme }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
    />
    <button
      className="theme-button send-button"
      style={theme}
      onClick={(e) => sendMessage(e)}
    >
      <TelegramIcon />
    </button>
  </form>
);

const Chat = forwardRef(({ name, room, userId, isModerator }, ref) => {
  const [chatUserId, setChatUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHidden, setChatHidden] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT, {
      path: "/api/socket/chat",
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log(socket.id);
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

    socket.on("roomData", ({ users }) => {
      console.log(users);
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
      setChatHidden(isHidden);
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

    socket.emit("join", { name, userId, room, isModerator }, (id) => {
      setChatUserId(id);
    });
  }, []);

  // code below pulls in functions from messaging for moderator actions
  useImperativeHandle(ref, () => ({
    deleteAllMessages() {
      console.log("child delete all called: " + room);
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
      socket.emit("sendMessage", { userId: chatUserId, room, message }, () => {
        setMessage("");
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
    <div
      className={clsx({
        chatOuterContainer: true,
        "display-none": !isModerator && chatHidden,
      })}
    >
      <div className="chatContainer">
        <div className={"infoBar" + (chatHidden ? " grey" : "")}>
          <div className="leftInnerContainer box-header">
            <img src={ChatWhiteIcon} className="info-bar-icon"></img>
            <h3 className="chatText">Chat</h3>
          </div>
          <div className="rightInnerContainer">
            {chatHidden ? <h3 className="chatText">(Hidden)</h3> : null}
          </div>
        </div>
        <Messages
          messages={messages}
          chatUserId={chatUserId}
          isModerator={isModerator}
          deleteMessage={deleteMessage}
          restoreMessage={restoreMessage}
        />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
});

export default Chat;
