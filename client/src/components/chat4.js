import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";

/* Icons */
import TelegramIcon from "@material-ui/icons/Telegram";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
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

const Messages = ({ messages, name, isModerator }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} isModerator={isModerator} />
      </div>
    ))}
  </ScrollToBottom>
);

const Message = ({ message: { text, user }, name, isModerator }) => {

  let isSentByCurrentUser = false;

  if (user === name) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{name}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>

      {/* Moderator Controls */}
      {isModerator === "true" && (
        <Tooltip title="Delete chat message" className="delete-chat-message">
          <DeleteOutlineIcon />
        </Tooltip>
      )}

    </div>
  ) : (
    <div className="messageContainer justifyStart">

      {/* Moderator Controls */}
      {isModerator === "true" && (
        <Tooltip title="Delete chat message" className="delete-chat-message">
          <DeleteOutlineIcon />
        </Tooltip>
      )}

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

const Chat = ({ room, name, isModerator }) => {
  //const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatVisible, setChatVisible] = useState(true);

  console.log(room);

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
      setMessages((messages) => [...messages, message]);
    });

    socket.on("setChatVisible", (isVisible) => {
      setChatVisible(isVisible);
    });

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", { name, room, message }, () => setMessage(""));
    }
  };

  return (
    <div 
      className={clsx({
        "chatOuterContainer": true,
        "display-none": (isModerator === "false" && chatVisible === false),
      })}
    >
      <div className="chatContainer">
        <InfoBar />
        <Messages 
          messages={messages} 
          name={name} 
          isModerator={isModerator}
        />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
