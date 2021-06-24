import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import FoldingCube from "./FoldingCube";

import Cookies from "universal-cookie";
import createUUID from "react-uuid";
import { toast } from "react-toastify";

import clsx from "clsx";

/* Tabs */
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, withStyles } from "@material-ui/core/styles";

/* Icons */
import TelegramIcon from "@material-ui/icons/Telegram";
import io from "socket.io-client";

import api from "../api/server";
import { props } from "bluebird";

const cookies = new Cookies();

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/" : "/";

const Messages = ({ messages, chatUserId, primaryColor }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message
          message={message}
          chatUserId={chatUserId}
          primaryColor={primaryColor}
        />
      </div>
    ))}
  </ScrollToBottom>
);

const Message = ({
  message: { text, user, userId, id, deleted, isNotification },
  chatUserId,
  primaryColor,
}) => {
  let isSentByCurrentUser = false;

  if (userId === chatUserId) {
    isSentByCurrentUser = true;
  }

  if (deleted) {
    // if the message is deleted, don't show the message
    return null;
  }

  if (isNotification) {
    return <p className="sentText justifyCenter ">{text}</p>;
  }

  return isSentByCurrentUser ? (
    <div className={"messageContainer"}>
      <span className="messageUser " style={{ color: primaryColor }}>
        {user}
      </span>
      <span className="messageText">{ReactEmoji.emojify(text)}</span>
    </div>
  ) : (
    <div className={"messageContainer"}>
      <span className="messageUser " style={{ color: primaryColor }}>
        {user}
      </span>
      <span className="messageText">{ReactEmoji.emojify(text)}</span>
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
      className="chatTextAreaContainer"
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
      backgroundColor: "#eaeaea",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => {
  return {
    root: {
      textTransform: "none",
      height: "40px",
      color: "rgba(0, 0, 0, 0.9)",
      fontSize: "18px",
      fontWeight: "300",
      fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(
        ","
      ),
      background: "#eaeaea",
      borderRadius: "5px",
      margin: "3px 3px 0px 3px",
      fontWeight: "300",
      fontSize: "1rem",

      "&:hover": {
        background: "rgba(255,255,255,0.5)",
        opacity: 1,
      },
      "&$selected": {
        color: "#b0281c", // this is overwritten in theme.js with the event theme color
        background: "#fff",
      },
      "&:focus": {
        outline: 0,
      },
    },
    selected: {},
  };
})((props) => <Tab disableRipple {...props} />);

const Input = ({ setMessage, sendMessage, message, theme, chatReady }) => (
  <form className="chat-input-container">
    <input
      className="chat-input width-80"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
      disabled={!chatReady}
    />

    <button
      className="theme-button send-button width-20"
      style={theme}
      onClick={(e) => sendMessage(e)}
    >
      <TelegramIcon />
    </button>
  </form>
);

const InputAskQuestion = ({ setQuestion, sendQuestion, question, theme }) => (
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
);

const Chat = ({ event, room, userId, registrationId, settings }) => {
  const classes = useStyles();
  const [chatUserId, setChatUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatHidden, setChatHidden] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [chatReady, setChatReady] = useState(false);
  const [chatTabEnabled, setChatTabEnabled] = useState(false);
  const [questionsTabEnabled, setQuestionsTabEnabled] = useState(false);
  const [reconnect, setReconnect] = useState(false);
  const [isInitialConnect, setIsInitialConnect] = useState(true);
  const [socket, setSocket] = useState(null);
  const connectRef = useRef();

  // set a ref to isInitialConnect so we can access the latest state from within the on connect callback
  connectRef.current = isInitialConnect;

  // Index numbers for tabs:
  const chatIndex = 0;
  const questionIndex = chatTabEnabled && !chatHidden ? 1 : 0;

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchChatRoomData = async () => {
      const chatRoom = await api.get("/api/chatroom/id", {
        params: { roomId: room },
      });

      setChatTabEnabled(chatRoom.data.chatEnabled);
      setQuestionsTabEnabled(chatRoom.data.questionsEnabled);
    };
    fetchChatRoomData();
  }, [room, settings.triggerSectionReactUpdate]);

  useEffect(() => {
    const _socket = io(ENDPOINT, {
      path: "/api/socket/chat",
      transports: ["websocket"],
      // rejectUnauthorized for testing purposes only! Not to be deployed to prod!
      rejectUnauthorized: false,
    });

    _socket.on("connect", () => {
      setChatReady(true);

      // if there is no userId (eventscape account) or registrationId (registered user) then we need a uuid to idenfity the anonymous visitor
      var uuid = null;
      if (!userId && !registrationId) {
        if (!cookies.get("uuid")) cookies.set("uuid", createUUID());

        uuid = cookies.get("uuid");
      }

      _socket.emit(
        "join",
        {
          userId,
          registrationId,
          uuid,
          room,
          isInitialConnect: connectRef.current,
        },
        (id) => {
          // If it's the initial connection, set the chat user id
          if (connectRef.current) setChatUserId(id);
          // sets the initial connect flag so that future connections are flagged as reconnections not initial connections
          setIsInitialConnect(false);
        }
      );
    });

    _socket.io.on("reconnect", () => {
      console.log("reconnected!");
    });
    _socket.on("reconnect_attempt", () => {
      console.log("reconnect attempt!");
    });

    _socket.on("reconnect_failed", () => {
      console.log("reconnect failed!");
    });

    _socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
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

    _socket.on("disconnect", function () {
      console.log("socket disconnected", _socket);
    });

    setSocket(_socket);
  }, [reconnect, room]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message && chatReady) {
      setChatReady(false);
      if (socket)
        socket.emit("sendMessage", { chatUserId, room, message }, () => {
          setMessage("");
          setChatReady(true);
        });
    }
  };

  const sendQuestion = (event) => {
    event.preventDefault();

    if (question) {
      if (socket)
        socket.emit("sendQuestion", { chatUserId, room, question }, () => {
          setQuestion("");
          toast.success("Your question was submitted to the hosts!");
        });
    } else if (!question) {
      toast.error("Please enter a question.");
    }
  };

  const deleteMessage = (id) => {
    if (socket) socket.emit("deleteMessage", { id, room });
  };

  const restoreMessage = (id) => {
    if (socket) socket.emit("restoreMessage", { id, room });
  };

  return (
    <div
      className={clsx({
        chatOuterContainer: true,
        "display-none": chatHidden && !questionsTabEnabled,
      })}
    >
      <div className="chatContainer">
        <div>
          <StyledTabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="simple tabs example"
            indicatorColor="secondary"
            variant="fullWidth"
          >
            {!chatHidden && chatTabEnabled && (
              <StyledTab
                primaryColor="test"
                label="Chat"
                {...a11yProps(chatIndex)}
              />
            )}
            {questionsTabEnabled && (
              <StyledTab label="Ask a Question" {...a11yProps(questionIndex)} />
            )}
          </StyledTabs>
        </div>
        {!chatHidden && chatTabEnabled && (
          <TabPanel
            value={tabValue}
            index={chatIndex}
            classes={{ root: classes.tab }}
          >
            <>
              <Messages
                messages={messages}
                chatUserId={chatUserId}
                deleteMessage={deleteMessage}
                restoreMessage={restoreMessage}
                primaryColor={event.primaryColor}
              />
              <Input
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                chatReady={chatReady}
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
};

Chat.defaultProps = {
  chatTabEnabled: true,
  questionsTabEnabled: true,
};
const mapStateToProps = (state) => {
  return { settings: state.settings, event: state.event };
};

export default connect(mapStateToProps)(Chat);
