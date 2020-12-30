import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import TelegramIcon from "@material-ui/icons/Telegram";

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
      <h3 id="chatText">Chat</h3>
    </div>
    <div className="rightInnerContainer"></div>
  </div>
);

const Messages = ({ messages, name }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
  </ScrollToBottom>
);

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
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

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io(ENDPOINT, {
      path: "/api/socket",
      transports: ["websocket"],
    });
    socket.on("FromAPI", (data) => {
      console.log(data);
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("connect_error", (error) => {
      console.log(error);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="chatOuterContainer">
      <div className="chatContainer">
        <InfoBar />
        <Messages messages={messages} name={name} />
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
