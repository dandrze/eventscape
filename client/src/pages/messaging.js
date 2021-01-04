import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import NavBar3 from "../components/navBar3.js";
import "./messaging.css";
import Chat from "../components/chat4.js";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch1 from "../components/switch";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AlertModal from "../components/AlertModal";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000/";

let socket;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Messaging = (props) => {
  const classes = useStyles();
  const [displayName, setDisplayName] = React.useState("Moderator");
  const [isHidden, setIsHidden] = React.useState({
    checked: false,
  });
  const [navAlertOpen, setNavAlertOpen] = React.useState(false);

  const handleChangeDisplayName = (event) => {
    setDisplayName(event.target.value);
  };
  const handleChangeIsHidden = (event) => {
    socket.emit("setChatHidden", {
      isHidden: event.target.checked,
      room: props.event.id,
    });
    setIsHidden({ ...isHidden, [event.target.name]: event.target.checked });
  };
  const handleNavAlertOpen = () => {
    setNavAlertOpen(true);
  };
  const handleNavAlertClose = () => {
    setNavAlertOpen(false);
  };

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        highlight="messaging"
        content={
          <div className="mainWrapper container-width">
            <div className="form-box shadow-border" id="chat">
              <div className="chat-container">
                {props.event.id ? (
                  <Chat
                    room={props.event.id}
                    name={displayName}
                    isModerator={true}
                  />
                ) : null}
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
                    handleNavAlertClose();
                  }}
                  text="Are you sure you want to delete all chat messages?"
                  closeText="Go back"
                  continueText="Yes, Delete"
                />
              </div>
            </div>
            <div className="form-box shadow-border">
              <h3>Q&A</h3>
            </div>
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps)(Messaging);
