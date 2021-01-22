import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Tooltip from "@material-ui/core/Tooltip";
import { toast } from "react-toastify";
import "./ModeratorQuestions.css";

/* Icons */
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReplayIcon from "@material-ui/icons/Replay";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import io from "socket.io-client";

const ENDPOINT =
  window.location.hostname.split(".")[
    window.location.hostname.split(".").length - 1
  ] === "localhost"
    ? "http://localhost:5000/"
    : "https://eventscape.io/";

let socket;

const Questions = ({ questions, deleteMessage, restoreMessage }) => {
  return (
    <ScrollToBottom className="messages">
      {questions.map((question, i) => (
        <div key={i}>
          <Question
            question={question}
            deleteMessage={deleteMessage}
            restoreMessage={restoreMessage}
          />
        </div>
      ))}
    </ScrollToBottom>
  );
};

const Question = ({
  question: { id, text, name, time, email },
  deleteMessage,
  restoreMessage,
}) => {
  const [checked, setChecked] = useState(false);

  const handleCheck = (newChecked) => {
    setChecked(newChecked);
  };
  return (
    <div
      className={`questionContainer justifyEnd" + ${
        checked ? " questionChecked" : ""
      }`}
    >
      <p className="questionSendTime">
        {new Date(time).toLocaleTimeString("en-us", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div className="questionMiddleContainer">
        <div className="questionNameTextContainer">
          <span className="questionText">
            <span className="questionUsername">{name}</span>
            {text}
          </span>
        </div>
        <div className="questionUsernameEmail">{email}</div>
      </div>
      {checked ? (
        <Tooltip title="Uncheck" className="check-question">
          <CheckBoxIcon onClick={() => handleCheck(false)} />
        </Tooltip>
      ) : (
        <Tooltip title="Check" className="check-question">
          <CheckBoxOutlineBlankIcon onClick={() => handleCheck(true)} />
        </Tooltip>
      )}
    </div>
  );
};

const ModeratorQuestions = forwardRef(
  ({ name, room, userId, chatTabEnabled, questionTabEnabled }, ref) => {
    const [chatUserId, setChatUserId] = useState("");
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      socket = io(ENDPOINT, {
        path: "/api/socket/chat",
        transports: ["websocket"],
      });
      socket.on("connect", () => {
        console.log(socket.id);
      });
      socket.on("connect_error", (error) => {
        setQuestions((questions) => [
          ...questions,
          { text: error, isNotification: true },
        ]);
      });

      socket.on("error", (error) => {
        setQuestions((questions) => [
          ...questions,
          { text: error, isNotification: true },
        ]);
      });

      socket.on("question", ({ name, text, time, email }) => {
        setQuestions((questions) => [
          ...questions,
          { name, text, time, email },
        ]);
      });

      socket.emit("join", { name, userId, room, isModerator: true }, (id) => {
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

    return (
      <div className="chatOuterContainer">
        <div className="chatContainer">
          <div className="infoBar moderator-questions-header">Questions</div>
          <Questions questions={questions} chatUserId={chatUserId} />
        </div>
      </div>
    );
  }
);

export default ModeratorQuestions;
