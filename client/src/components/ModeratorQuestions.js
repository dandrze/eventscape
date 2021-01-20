import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
  } from "react";
  import ScrollToBottom from "react-scroll-to-bottom";
  import Tooltip from "@material-ui/core/Tooltip";
  import "./ModeratorQuestions.css";
  
  /* Icons */
  import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
  import ReplayIcon from "@material-ui/icons/Replay";
  import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
  import CheckBoxIcon from '@material-ui/icons/CheckBox';
  
  import io from "socket.io-client";
    
  const ENDPOINT =
    window.location.hostname.split(".")[
      window.location.hostname.split(".").length - 1
    ] === "localhost"
      ? "http://localhost:5000/"
      : "https://eventscape.io/";
  
  let socket;
  
  const Questions = ({
    questions,
    chatUserId,
    deleteMessage,
    restoreMessage,
  }) => (
    <ScrollToBottom className="messages">
      {/*
      {questions.map((question, i) => (
        <div key={i}>
          <Message
            message={question}
            chatUserId={chatUserId}
            isModerator={isModerator}
            deleteMessage={deleteMessage}
            restoreMessage={restoreMessage}
          />
        </div>
      ))}
      */}
          <Question
            question={"test question", "test user", 23, 453}
            chatUserId={chatUserId}
            checked={true}
            deleteMessage={deleteMessage}
            restoreMessage={restoreMessage}
          />
    </ScrollToBottom>
  );
  
  const Question = ({
    question: { text, user, userId, id },
    chatUserId,
    checked, 
    deleteMessage,
    restoreMessage,
  }) => {

  
  
    return (
      <div className={"messageContainer justifyEnd "}>
        <p className="sentText pr-10">{user}</p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{text}</p>
        </div>
  
        {(checked ? (
            <Tooltip title="Restore chat message" className="delete-chat-message">
              <ReplayIcon onClick={() => restoreMessage(id)} />
            </Tooltip>
          ) : (
            <Tooltip title="Delete chat message" className="delete-chat-message">
              <DeleteOutlineIcon onClick={() => deleteMessage(id)} />
            </Tooltip>
          ))}
      </div>
    );
  };
  
  
  const ModeratorQuestions = forwardRef(({ name, room, userId, isModerator, chatTabEnabled, questionTabEnabled }, ref) => {
    const [chatUserId, setChatUserId] = useState("");
    const [questions, setQuestions] = useState("");
  
    {/*useEffect(() => {
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
  */}

  
    {/*const sendQuestion = (event) => {
      // David to connect
  
      event.preventDefault();
  
      if (questions) {
        socket.emit("sendQuestion", { userId: chatUserId, room, question }, () => {
          setQuestion("");
        });
      }
    };*/}
  
    return (
      <div className="chatOuterContainer">
        <div className="chatContainer">
          <div className="infoBar moderator-questions-header">
            Questions
          </div>
          {/*<Questions
            questions={questions}
            chatUserId={chatUserId}
          />*/}
          <ScrollToBottom className="messages">

            <div className={"questionContainer justifyEnd"}>
              <p className="questionSendTime">
                1:26pm
              </p>
              <div className="questionMiddleContainer">
                <div className="questionNameTextContainer">
                  <span className="questionText"><span className="questionUsername">Kevin Richardson    </span>question Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</span>
                </div>
                <div className="questionUsernameEmail">kevin.richardson101@gmail.com</div>

              </div>
              {(false ? (
                  <Tooltip title="Uncheck" className="check-question">
                    <CheckBoxIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Check" className="check-question">
                    <CheckBoxOutlineBlankIcon />
                  </Tooltip>
                ))}
            </div>

            <div className={"questionContainer justifyEnd  questionChecked"}>
              <p className="questionSendTime">
                1:26pm
              </p>
              <div className="questionMiddleContainer">
                <div className="questionNameTextContainer">
                  <span className="questionText"><span className="questionUsername">Kevin Richardson    </span>question Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</span>
                </div>
                <div className="questionUsernameEmail">kevin.richardson101@gmail.com</div>

              </div>
              {(true ? (
                  <Tooltip title="Uncheck" className="check-question">
                    <CheckBoxIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Check" className="check-question">
                    <CheckBoxOutlineBlankIcon />
                  </Tooltip>
                ))}
            </div>

            <div className={"questionContainer justifyEnd"}>
              <p className="questionSendTime">
                1:26pm
              </p>
              <div className="questionMiddleContainer">
                <div className="questionNameTextContainer">
                  <span className="questionText"><span className="questionUsername">Kevin Richardson</span>question Lorem ipsum dolor sit amet</span>
                </div>
                <div className="questionUsernameEmail">kevin.richardson101@gmail.com</div>

              </div>
              {(false ? (
                  <Tooltip title="Uncheck" className="check-question">
                    <CheckBoxIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Check" className="check-question">
                    <CheckBoxOutlineBlankIcon />
                  </Tooltip>
                ))}
            </div>
          </ScrollToBottom>
        </div>
      </div>
    );
  });
  
  export default ModeratorQuestions;
  