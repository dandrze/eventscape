import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import SendIcon from "@material-ui/icons/Send";

/* Code based on the following tutorial: 
https://www.youtube.com/watch?v=ZwFA3YMfkoc
https://github.com/adrianhajdin/project_chat_application
*/

// import queryString from 'query-string';
// import io from "socket.io-client";

// import Messages from '../Messages/Messages';
// import Input from '../Input/Input';

import "./chat4.css";

// const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

// let socket;

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
      className="sendButton"
      style={theme}
      onClick={(e) => sendMessage(e)}
    >
      <SendIcon />
    </button>
  </form>
);

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  /*useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);*/

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      //socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
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
