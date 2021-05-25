import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import FoldingCube from "../FoldingCube";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import SaveIcon from "@material-ui/icons/Save";
import { CSVLink, CSVDownload } from "react-csv";

import "./ModeratorChat.css";
import * as actions from "../../actions";
import ModeratorQuestions from "./ModeratorQuestions";
import ModeratorChat from "./ModeratorChat";
import AlertModal from "../AlertModal";
import Switch1 from "../switch";
import api from "../../api/server";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "0px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ModeratorDashboard = ({
  room,
  user,
  getChatModerator,
  updateChatModerator,
}) => {
  const chatRef = useRef();
  const chatHistoryDownload = useRef();
  const classes = useStyles();

  const [displayName, setDisplayName] = useState("");
  const [chatHidden, setChatHidden] = React.useState(room.chatHidden);
  const [navAlertOpen, setNavAlertOpen] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [displayNameLoading, setDisplayNameLoading] = React.useState(false);
  const [chatHistory, setChatHistory] = useState(null);
  const [questionsHistory, setQuestionsHistory] = useState(null);

  useEffect(() => {
    fetchDataAsync();
  }, []);

  useEffect(() => {
    // The csv download library only has a link that doesn't work with async requests and a component that auto downloads on render
    // Our logic for downloading the csv is when the user clicks export, chatHistory is set to the result of the database call, and then <CSVDownload /> renders
    // Then after the component is mounted we set chatHistory back to null so that CSVDownload doesn't trigger another download
    if (chatHistory) setChatHistory(null);
  }, [chatHistory]);

  useEffect(() => {
    // The csv download library only has a link that doesn't work with async requests and a component that auto downloads on render
    // Our logic for downloading the csv is when the user clicks export, questionsHistory is set to the result of the database call, and then <CSVDownload /> renders
    // Then after the component is mounted we set questionsHistory back to null so that CSVDownload doesn't trigger another download
    if (questionsHistory) setQuestionsHistory(questionsHistory);
  }, [questionsHistory]);

  const fetchDataAsync = async () => {
    const chatUser = await getChatModerator(user.id, room.id);

    setDisplayName(chatUser.name);
    setIsLoaded(true);
  };

  const handleChangeDisplayName = (event) => {
    setDisplayName(event.target.value);
  };

  const handleSubmitDisplayName = async () => {
    await updateChatModerator({
      AccountId: user.id,
      name: displayName,
      ChatRoomId: room.id,
    });
    chatRef.current.refreshChat();
    setDisplayNameLoading(false);
  };

  const handleChangeChatHidden = (event) => {
    chatRef.current.updateChatHidden(event.target.checked);

    setChatHidden(event.target.checked);
  };
  const handleNavAlertOpen = () => {
    setNavAlertOpen(true);
  };
  const handleNavAlertClose = () => {
    setNavAlertOpen(false);
  };

  const handleDeleteAllMessages = () => {
    chatRef.current.deleteAllMessages();
    setNavAlertOpen(false);
  };

  const handleExportChat = async () => {
    const chatMessages = await api.get("/api/chatroom/export/chat", {
      params: { roomId: room.id },
    });

    const history = chatMessages.data.map((chatMessage) => {
      return {
        Message: chatMessage.text,
        "Sent At": new Date(chatMessage.createdAt).toLocaleString("en-us", {
          dateStyle: "long",
          timeStyle: "long",
        }),
        Name: chatMessage.ChatUser.name || "",
        "Email Address": chatMessage.ChatUser.Registration?.emailAddress || "",
      };
    });

    setChatHistory(history);
  };

  const handleExportQuestions = async () => {
    const questions = await api.get("/api/chatroom/export/questions", {
      params: { roomId: room.id },
    });

    const history = questions.data.map((question) => {
      return {
        Question: question.text,
        "Sent At": new Date(question.createdAt).toLocaleString("en-us", {
          dateStyle: "long",
          timeStyle: "long",
        }),
        Checked: question.isChecked,
        "First Name": question.ChatUser.Registration?.firstName || "",
        "Last Name": question.ChatUser.Registration?.lastName || "",
        "Email Address": question.ChatUser.Registration?.emailAddress || "",
      };
    });

    setQuestionsHistory(history);
  };

  if (!isLoaded) return <FoldingCube />;
  return (
    <div className="form-box shadow-border" style={{ marginBottom: "60px" }}>
      {/* The components below are used to download csvs. Upon render they will download the data in the data prop*/}
      {chatHistory ? <CSVDownload data={chatHistory} target="_blank" rel="noopener noreferrer" /> : null}
      {questionsHistory ? (
        <CSVDownload data={questionsHistory} target="_blank" rel="noopener noreferrer" />
      ) : null}

      <div className="room-bar">
        <p>Room: {room.name}</p>
      </div>
      <div className="moderator-chat-main-container">
        {room.chatEnabled ? (
          <div className="container-one-chat-window">
            <div className="chat-moderator-responsive">
              <div className="video-responsive-iframe">
                <ModeratorChat room={room.id} userId={user.id} ref={chatRef} />
              </div>
            </div>
            <Grid
              container
              spacing={3}
              alignItems="flex-end"
              style={{ marginTop: "70px" }}
            >
              <Grid item xs={6}>
                {/* Display Name */}
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    id="title"
                    label="Display Name"
                    variant="outlined"
                    value={displayName}
                    onChange={handleChangeDisplayName}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Save moderator display name">
                          <InputAdornment
                            position="end"
                            onClick={handleSubmitDisplayName}
                            style={{
                              color: "var(--main-color)",
                              cursor: "pointer",
                            }}
                          >
                            Save
                            <SaveIcon style={{ marginLeft: "4px" }} />
                          </InputAdornment>
                        </Tooltip>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {/* Temporarily Hide Chat */}
                <Tooltip title="Temporarily hides chat. To permanently remove chat, remove the design block that contains the chat window.">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch1
                          checked={chatHidden}
                          onChange={handleChangeChatHidden}
                          name="checked"
                        />
                      }
                      label="Temporarily Hide Chat"
                    />
                  </FormGroup>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                {/* Delete all chat message button */}
                <button
                  className="Button2"
                  onClick={handleNavAlertOpen}
                  style={{ width: "100%" }}
                >
                  Delete All Chat Messages
                </button>
              </Grid>
              <Grid item xs={6}>
                {/* Export Chat to CSV */}
                <Tooltip title="Export chat messages to csv file">
                  <button
                    className="Button2"
                    style={{ width: "100%" }}
                    onClick={handleExportChat}
                  >
                    Export
                  </button>
                </Tooltip>
              </Grid>
            </Grid>

            <AlertModal
              open={navAlertOpen}
              onClose={handleNavAlertClose}
              onContinue={() => {
                handleDeleteAllMessages();
              }}
              content="Are you sure you want to delete all chat messages?"
              closeText="Go back"
              continueText="Yes, Delete"
            />
          </div>
        ) : null}
        {room.questionsEnabled ? (
          <div className="container-two-question-window">
            <div className="chat-moderator-responsive">
              <div className="video-responsive-iframe">
                <ModeratorQuestions room={room.id} userId={user.id} />
              </div>
            </div>
            <Grid
              container
              spacing={3}
              alignItems="flex-end"
              style={{ marginTop: "70px" }}
            >
              <Grid item xs={6}>
                {/* Intentionally left blank */}
              </Grid>
              <Grid item xs={6}>
                {/* Export Questions to CSV */}
                <Tooltip title="Export questions to csv file">
                  <button
                    className="Button2"
                    style={{ width: "100%", marginTop: "auto" }}
                    onClick={handleExportQuestions}
                  >
                    Export
                  </button>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    model: state.model,
    event: state.event,
    settings: state.settings,
    user: state.user,
  };
};

export default connect(mapStateToProps, actions)(ModeratorDashboard);
