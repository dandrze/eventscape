import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import { ReactFormGenerator } from "../react-form-builder2/lib";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";
import api from "../../api/server";
import * as actions from "../../actions";
import Froala from "../froala";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import Cancel from "./cancel.svg";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "600px",
  },
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
    padding: "30px",
  },
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
}));

function RegistrationForm(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [openReSendLink, setOpenReSendLink] = useState(false);
  const [modalText, setModalText] = useState(false);
  const [formData, setFormData] = useState([]);
  const [emailAddress, setEmailAddress] = useState(
    props.standardFields ? props.standardFields.email : ""
  );
  const [emailAddressReSend, setEmailAddressReSend] = useState("");
  const [emailFound, setEmailFound] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState(
    props.standardFields ? props.standardFields.firstName : ""
  );
  const [lastName, setLastName] = useState(
    props.standardFields ? props.standardFields.lastName : ""
  );
  const [emailErrorText, setEmailErrorText] = useState("");
  const [regComplete, setRegComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeReSendLinkModal = () => {
    setOpenReSendLink(false);
  };

  const openReSendLinkModal = () => {
    setOpenReSendLink(true);
  };

  const fetchFormData = async () => {
    const formData = await api.get("/api/form", {
      params: { event: props.event.id },
    });
    if (formData.data) {
      setFormData(formData.data);
    }
  };

  const handleEmailChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleEmailReSendChange = (event) => {
    setEmailAddressReSend(event.target.value);
  };

  const handleEmailBlur = () => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    setEmailError(
      re.test(emailAddress) ? "" : "Please enter a valid email address"
    );
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = async (values) => {
    // Check to make sure the standard fields are valid first
    if (emailError || !emailAddress) {
      setModalText("Please enter a valid email");
      openModal();
    } else if (!firstName) {
      setModalText("Please enter your first name");
      openModal();
    } else if (!lastName) {
      setModalText("Please enter your last name");
      openModal();
    } else if (await props.fetchRegistration(emailAddress)) {
      setModalText("Registration already exists under email: " + emailAddress);
      openModal();
    } else {
      // If there is a custom callback (i.e. editting a registration) use that
      if (props.onSubmitCallback) {
        props.onSubmitCallback(values, emailAddress, firstName, lastName);
      } else {
        setIsLoading(true);
        // else use the default workflow
        const res = await props.addRegistration(
          props.event.id,
          values,
          emailAddress,
          firstName,
          lastName
        );
        setIsLoading(false);
        if (res) {
          setRegComplete(true);
        }
      }
    }
  };

  const handleResendEmailClick = async () => {
    const mailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailAddressReSend || !mailFormat.test(emailAddressReSend)) {
      setEmailErrorText("Please enter valid email address");
    } else {
      const registration = await props.fetchRegistration(emailAddressReSend);

      if (registration.email == emailAddressReSend) {
        setEmailFound(true);
        setEmailNotFound(false);
        await props.resendRegistrationEmail(emailAddressReSend, props.event.id);
      } else {
        setEmailNotFound(true);
        setEmailFound(false);
      }
    }
  };

  const validateEmailFormat = (inputText) => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return inputText.value.match(mailformat);
  };

  const nonEditableHtml = props.model.sections[props.sectionIndex].html.replace(
    `contenteditable="true"`,
    `contenteditable="false"`
  );

  return (
    <div>
      <AlertModal
        open={open}
        onClose={closeModal}
        onContinue={closeModal}
        text={modalText}
        closeText="Cancel"
        continueText="OK"
      />
      <div className="container">
        {/* if we're editing an input, just show the form. Otherwise we're dipslaying the entire component to the end user*/}
        {!props.isEditForm ? (
          <div className="form-editor-froala">
            {props.isLive ? (
              <FroalaEditorView model={nonEditableHtml} />
            ) : (
              <Froala sectionIndex={props.sectionIndex} />
            )}
          </div>
        ) : null}
        {isLoading ? (
          <CircularProgress className="margin-auto" />
        ) : (
          <div className="margin-auto">
            {regComplete ? (
              <div className="margin-auto">
                <div>Thank you for registering for {props.event.title}</div>
                <br />
                <div>
                  A confirmation email was sent to {emailAddress}. Please check
                  your spam if you don't see it in your inbox.
                </div>
              </div>
            ) : (
              <div className={!props.isEditForm ? "form-editor-react" : ""}>
                {/* the mandatory div below is copying the classnames from the react-form-builder2 generated components so the styling is the same*/}
                <div className="form-group">
                  <label>
                    <span>First Name</span>
                    <span class="label-required badge badge-danger">
                      Required
                    </span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    value={firstName}
                    onChange={handleFirstNameChange}
                  />
                  <label>
                    <span>Last Name</span>
                    <span class="label-required badge badge-danger">
                      Required
                    </span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    value={lastName}
                    onChange={handleLastNameChange}
                  />
                  <label>
                    <span>Email Address</span>
                    <span class="label-required badge badge-danger">
                      Required
                    </span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    value={emailAddress}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                  <div className="errorMessage">{emailError}</div>
                </div>
                <ReactFormGenerator
                  action_name={props.registerText || "Register now"}
                  onSubmit={handleSubmit}
                  data={formData}
                  answer_data={props.prePopulatedValues}
                  className="form-editor-react"
                />
                <label>
                  <span>Already registered? Click </span>
                  <span
                    className="theme-color"
                    onClick={openReSendLinkModal}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    here
                  </span>
                  <span> to re-send your event link.</span>
                </label>
              </div>
            )}{" "}
          </div>
        )}
      </div>
      {/* Re-send event link modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openReSendLink}
        onClose={closeReSendLinkModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
        className={classes.modal}
      >
        <Fade in={openReSendLink}>
          <div className={classes.paper}>
            <div className="cancel-bar">
              <Tooltip title="Close">
                <img
                  src={Cancel}
                  className="cancel-bar-icon"
                  onClick={closeReSendLinkModal}
                ></img>
              </Tooltip>
            </div>
            <div style={{ padding: "5px 30px 30px 30px", maxWidth: "550px" }}>
              <p>Please enter the email address you registered with.</p>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  type="email"
                  id="email"
                  label="Email"
                  variant="outlined"
                  value={emailAddressReSend}
                  onChange={handleEmailReSendChange}
                  placeholder="email@email.com"
                  helperText={emailErrorText}
                />
              </FormControl>
              <div className="btn-toolbar">
                <button
                  className="btn btn-school btn-big theme-button"
                  onClick={handleResendEmailClick}
                >
                  Re-Send My Event Link
                </button>
              </div>

              {/* Email found and link sent confirmation message: */}
              {emailFound === true && (
                <>
                  <br></br>
                  <br></br>
                  <p>
                    Your link to join the event has been sent to the email
                    address you entered.
                  </p>
                  <p>
                    Please check your inbox and if it’s not there, try checking
                    your junk mail.
                  </p>
                </>
              )}

              {/* Email not found message: */}
              {emailNotFound === true && (
                <>
                  <br></br>
                  <br></br>
                  <p>
                    No registration found for this address. Please close this
                    window and register to attend the event.
                  </p>
                </>
              )}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model };
};

export default connect(mapStateToProps, actions)(RegistrationForm);
