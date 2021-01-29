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
import createUUID from "react-uuid";

import clsx from "clsx";

/* Tabs */
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, withStyles } from "@material-ui/core/styles";

/* Icons */
import TelegramIcon from "@material-ui/icons/Telegram";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ReplayIcon from "@material-ui/icons/Replay";
import io from "socket.io-client";

import api from "../api/server";

const cookies = new Cookies();

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

/* for tabs */
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ flexGrow: "1", height: "calc(100% - 60px)" }}
    >
      {value === index && <span className="chatTextArea">{children}</span>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    "& > span": {
      width: "100%",
      backgroundColor: "white",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    height: "60px",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "18px",
    fontWeight: "300",
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    "&:hover": {
      color: "#fff",
      opacity: 1,
    },
    "&$selected": {
      color: "#fff",
      fontWeight: "400",
    },
    "&:focus": {
      color: "#fff",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

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

const InputAskQuestion = ({ setQuestion, sendQuestion, question, theme }) => (
  <div style={{ marginTop: "auto" }}>
    <form className="form-question">
      <textarea
        className="input-question"
        placeholder="Type a question..."
        value={question}
        onChange={({ target: { value } }) => setQuestion(value)}
      />
      <button
        className="theme-button send-button max-height-60"
        style={theme}
        onClick={(e) => sendQuestion(e)}
      >
        <div className="send-question-text">Send Question</div>
        <TelegramIcon />
      </button>
    </form>
  </div>
);

const Chat = forwardRef(
  ({ room, userId, registrationId, isModerator, settings }, ref) => {
    const classes = useStyles();
    const [chatUserId, setChatUserId] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");
    const [chatHidden, setChatHidden] = useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const [sendLoading, setSendLoading] = useState(false);
    const [chatTabEnabled, setChatTabEnabled] = useState(true);
    const [questionsTabEnabled, setQuestionsTabEnabled] = useState(true);

    // Index numbers for tabs:
    const chatIndex = 0;
    const questionIndex =
      chatTabEnabled === true && questionsTabEnabled === true ? 1 : 0;

    const handleChangeTab = (event, newValue) => {
      setTabValue(newValue);
    };

    useEffect(() => {
      const fetchChatRoomData = async () => {
        const chatRoom = await api.get("/api/chatroom/id", {
          params: { roomId: room },
        });

        console.log(chatRoom);

        setChatTabEnabled(chatRoom.data.chatEnabled);
        setQuestionsTabEnabled(chatRoom.data.questionsEnabled);
      };
      fetchChatRoomData();
    }, [room, settings.triggerChatUpdate]);

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

      // if there is no userId (eventscape account) or registrationId (registered user) then we need a uuid to idenfity the anonymous visitor
      var uuid = null;
      if (!userId && !registrationId) {
        if (!cookies.get("uuid")) cookies.set("uuid", createUUID());

        uuid = cookies.get("uuid");
      }

      socket.emit(
        "join",
        { userId, registrationId, uuid, room, isModerator },
        (id) => {
          setChatUserId(id);
        }
      );
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

    const sendQuestion = (event) => {
      // David to connect

      event.preventDefault();

      if (question) {
        socket.emit("sendQuestion", { chatUserId, room, question }, () => {
          setQuestion("");
          alert(
            "Question successfully submitted! (Temporary alert, replace with better alert type)"
          );
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
          <div
            className={
              isModerator && (chatHidden || !chatTabEnabled)
                ? "infoBar grey"
                : "infoBar"
            }
          >
            <StyledTabs
              value={tabValue}
              onChange={handleChangeTab}
              aria-label="simple tabs example"
              indicatorColor="secondary"
              variant="fullWidth"
            >
              {(chatTabEnabled ||
                isModerator) /* if it's moderator, still display the component but as "disabled"*/ && (
                <StyledTab
                  label={
                    chatHidden
                      ? "Chat (Hidden)"
                      : !chatTabEnabled
                      ? "Chat (Disabled)"
                      : "Chat"
                  }
                  isHidden={chatHidden}
                  {...a11yProps(chatIndex)}
                />
              )}
              {questionsTabEnabled && (
                <StyledTab
                  label="Ask a Question"
                  isHidden={chatHidden}
                  {...a11yProps(questionIndex)}
                />
              )}
            </StyledTabs>
          </div>
          {chatTabEnabled && (
            <TabPanel
              value={tabValue}
              index={chatIndex}
              classes={{ root: classes.tab }}
            >
              <>
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
                  sendLoading={sendLoading}
                />
              </>
            </TabPanel>
          )}
          {questionsTabEnabled && (
            <TabPanel
              value={tabValue}
              index={questionIndex}
              classes={{ root: classes.tab }}
            >
              <InputAskQuestion
                question={question}
                setQuestion={setQuestion}
                sendQuestion={sendQuestion}
              />
            </TabPanel>
          )}
        </div>
      </div>
    );
  }
);

Chat.defaultProps = {
  isModerator: false,
  chatTabEnabled: true,
  questionsTabEnabled: true,
};
const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps)(Chat);
