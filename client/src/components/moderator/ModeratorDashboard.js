import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

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
  const chatRef = React.useRef();
  const classes = useStyles();

  const [displayName, setDisplayName] = useState("");
  const [isHidden, setIsHidden] = React.useState({
    checked: room.isHidden,
  });
  const [navAlertOpen, setNavAlertOpen] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [displayNameLoading, setDisplayNameLoading] = React.useState(false);

  useEffect(() => {
    fetchDataAsync();
  }, []);

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

  const handleChangeIsHidden = (event) => {
    chatRef.current.setIsHidden(event.target.checked);

    setIsHidden({ ...isHidden, [event.target.name]: event.target.checked });
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

  if (!isLoaded) return <CircularProgress />;
  return (
    <div className="form-box shadow-border">
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
                          checked={isHidden.checked}
                          onChange={handleChangeIsHidden}
                          name="checked"
                        />
                      }
                      label="Temporarily Hide Chat"
                    />
                  </FormGroup>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                {/* Update Display Name Button */}
                {displayNameLoading ? (
                  <div className="text-center pt-1">
                    <CircularProgress />
                  </div>
                ) : (
                  <button
                    className="Button2 mt-3"
                    onClick={handleSubmitDisplayName}
                    style={{ width: "100%" }}
                  >
                    Update Display Name
                  </button>
                )}
              </Grid>
              <Grid item xs={6}>
                {/* Delete all chat message button */}
                <button
                  className="Button2 mt-3"
                  onClick={handleNavAlertOpen}
                  style={{ width: "100%" }}
                >
                  Delete All Chat Messages
                </button>
              </Grid>
            </Grid>

            <AlertModal
              open={navAlertOpen}
              onClose={handleNavAlertClose}
              onContinue={() => {
                handleDeleteAllMessages();
              }}
              text="Are you sure you want to delete all chat messages?"
              closeText="Go back"
              continueText="Yes, Delete"
            />
          </div>
        ) : null}
        {room.questionsEnabled ? (
          <div className="container-two-question-window">
            <div className="chat-moderator-responsive">
              <div className="video-responsive-iframe">
                <ModeratorQuestions
                  room={room.id}
                  userId={user.id}
                  isHIdden={isHidden.checked}
                />
              </div>
            </div>
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
