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

const Questions = ({ questions, setChecked }) => {
  return (
    <ScrollToBottom className="messages">
      {questions.map((question, i) => (
        <div key={i}>
          <Question question={question} setChecked={setChecked} />
        </div>
      ))}
    </ScrollToBottom>
  );
};

const Question = ({ question, setChecked }) => {
  console.log(question);
  const { id, text, name, time, email, isChecked } = question;
  const handleCheck = (newChecked) => {
    setChecked(id, newChecked);
  };
  return (
    <div
      className={`questionContainer justifyEnd" + ${
        isChecked ? " questionChecked" : ""
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
      {isChecked ? (
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
  ({ name, room, userId, questionTabEnabled, isHidden }) => {
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

      socket.on("question", (question) => {
        setQuestions((questions) => [...questions, question]);
      });

      socket.emit("join", { name, userId, room, isModerator: true }, (id) => {
        setChatUserId(id);
      });
    }, []);

    const setChecked = (id, isChecked) => {
      socket.emit("setQuestionChecked", { id, isChecked });
      setQuestions((questions) =>
        questions.map((question) => {
          // if the id matches, set isChecked to the new value, otherwise set it to the existing value
          const newChecked =
            question.id === id ? isChecked : question.isChecked;
          return { ...question, isChecked: newChecked };
        })
      );
    };

    return (
      <div className="chatOuterContainer">
        <div className="chatContainer">
          <div
            className={
              isHidden || !questionTabEnabled
                ? "infoBar moderator-questions-header grey"
                : "infoBar moderator-questions-header"
            }
          >
            Questions{" "}
            {!questionTabEnabled ? "(Disabled)" : isHidden ? "(Hidden)" : ""}
          </div>
          <Questions
            questions={questions}
            chatUserId={chatUserId}
            setChecked={setChecked}
          />
        </div>
      </div>
    );
  }
);

export default ModeratorQuestions;
