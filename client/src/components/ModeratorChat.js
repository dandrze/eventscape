import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
import Chat from "../components/chat4.js";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch1 from "../components/switch";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import AlertModal from "../components/AlertModal";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ModeratorChat = ({ room }) => {
  const classes = useStyles();

  const [displayName, setDisplayName] = useState("Moderator");
  const [isHidden, setIsHidden] = React.useState({
    checked: false,
  });
  const [navAlertOpen, setNavAlertOpen] = React.useState(false);

  const chatRef = React.useRef();

  const handleChangeDisplayName = (event) => {
    setDisplayName(event.target.value);
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

  return (
    <div className="form-box shadow-border" id="chat">
      <div className="chat-container">
        <Chat room={room} name={displayName} isModerator={true} ref={chatRef} />
      </div>
      <div className="chat-options">
        <p>Room: Main Chat</p>
        <FormControl variant="outlined" className={classes.formControl}>
          {/* Display Name */}
          <TextField
            id="title"
            label="Display Name"
            variant="outlined"
            value={displayName}
            onChange={handleChangeDisplayName}
          />
          <br></br>
          <br></br>
        </FormControl>
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
        <button className="Button2" onClick={handleNavAlertOpen}>
          Delete All Chat Messages
        </button>
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(ModeratorChat);
