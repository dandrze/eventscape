import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as actions from "../actions";

//put email list table in modal:

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "0px",
  },
}));

function SendTestEmail({ subject, html, eventId, sendTestEmail, recipient }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(recipient.email);
  const [firstName, setFirstName] = React.useState(recipient.firstName);
  const [lastName, setLastName] = React.useState(recipient.lastName);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    setOpen(false);
    sendTestEmail(eventId, {
      subject,
      html,
      eventId,
      email,
      firstName,
      lastName,
    });
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  };

  return (
    <div>
      <button className="Button1" id="testEmail" onClick={handleOpen}>
        Send Test Email
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div id="testEmailModal">
              <label htmlFor="email">Send test email to: </label>
              <input
                className="d-block w-300"
                type="text"
                name="email"
                value={email}
                onChange={handleChangeEmail}
              ></input>
              <input
                className="d-block w-300"
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChangeFirstName}
              ></input>
              <input
                className="d-block w-300"
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChangeLastName}
              ></input>
              <button className="Button1" onClick={handleSend}>
                Send!
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(SendTestEmail);
