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

const ENDPOINT = "http://localhost:5000/";

let socket;

const InfoBar = () => (
  <div className="infoBar">
    <div className="leftInnerContainer box-header">
      <img src={ChatWhiteIcon} className="info-bar-icon"></img>
      <h3 id="chatText">Chat</h3>
    </div>
    <div className="rightInnerContainer"></div>
  </div>
);

const Messages = ({
  messages,
  name,
  isModerator,
  deleteMessage,
  restoreMessage,
}) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message
          message={message}
          name={name}
          isModerator={isModerator}
          deleteMessage={deleteMessage}
          restoreMessage={restoreMessage}
        />
      </div>
    ))}
  </ScrollToBottom>
);

const Message = ({
  message: { text, user, id, deleted },
  name,
  isModerator,
  deleteMessage,
  restoreMessage,
}) => {
  let isSentByCurrentUser = false;

  if (user === name) {
    isSentByCurrentUser = true;
  }

  if (deleted && !isModerator) {
    // if the message is deleted and it is not the moderator, don't show the message
    return null;
  }

  const deletedClassName = isModerator && deleted ? "deleted-message" : null;

  return isSentByCurrentUser ? (
    <div className={"messageContainer justifyEnd " + deletedClassName}>
      <p className="sentText pr-10">{name}</p>
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

  console.log(messages);
  console.log(chatHidden);

  useEffect(() => {
    socket = io(ENDPOINT, {
      path: "/api/socket",
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("connect_error", (error) => {
      console.log(error);
    });

    socket.on("roomData", ({ users }) => {
      console.log(users);
    });

    socket.on("message", (message) => {
      console.log(message);
      setMessages((messages) => [...messages, message]);
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
      console.log(isHidden);
      setChatHidden(isHidden);
    });

    socket.on("deleteAll", () => {
      setMessages((messages) =>
        messages.map((msg) => {
          return { ...msg, deleted: true };
        })
      );
    });

    socket.emit("join", { name, userId, room }, (id) => {
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
    console.log(id, room);
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
      {isModerator && chatHidden ? (
        <p>Chat Hidden From Participants</p>
      ) : (
        <div className="chatContainer">
          <InfoBar />
          <Messages
            messages={messages}
            name={name}
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
      )}
    </div>
  );
});

export default Chat;
