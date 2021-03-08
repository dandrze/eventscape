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

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Modal1 from "../Modal1";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
}));

function RegistrationForm({
  settings,
  event,
  model,
  standardFields,
  onSubmitCallback,
  fetchRegistration,
  registerText,
  prePopulatedValues,
  sectionIndex,
  isEditForm,
  addRegistration,
  resendRegistrationEmail,
  isLive,
}) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [openReSendLink, setOpenReSendLink] = useState(false);
  const [modalText, setModalText] = useState(false);
  const [formData, setFormData] = useState([]);
  const [emailAddress, setEmailAddress] = useState(
    standardFields ? standardFields.email : ""
  );
  const [emailAddressReSend, setEmailAddressReSend] = useState("");
  const [emailFound, setEmailFound] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState(
    standardFields ? standardFields.firstName : ""
  );
  const [lastName, setLastName] = useState(
    standardFields ? standardFields.lastName : ""
  );
  const [emailErrorText, setEmailErrorText] = useState("");
  const [regComplete, setRegComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, [settings.triggerSectionReactUpdate]);

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
    const res = await api.get("/api/form", {
      params: { event: event.id },
    });
    if (res.data) {
      setFormData(res.data);
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
    } else if (
      !isEditForm &&
      (await fetchRegistration(emailAddress, event.id))
    ) {
      setModalText("Registration already exists under email: " + emailAddress);
      openModal();
    } else {
      // If there is a custom callback (i.e. editting a registration) use that
      if (onSubmitCallback) {
        onSubmitCallback(values, emailAddress, firstName, lastName);
      } else {
        setIsLoading(true);
        // else use the default workflow
        const res = await addRegistration(
          event.id,
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
      const registration = await fetchRegistration(
        emailAddressReSend,
        event.id
      );

      if (registration.emailAddress == emailAddressReSend) {
        setEmailFound(true);
        setEmailNotFound(false);
        await resendRegistrationEmail(emailAddressReSend, event.id);
      } else {
        setEmailNotFound(true);
        setEmailFound(false);
      }
    }
  };

  return (
    <div>
      <AlertModal
        open={open}
        onClose={closeModal}
        onContinue={closeModal}
        content={modalText}
        continueText="OK"
      />
      <div className="container block-container">
        <div className="row">
          {/* if we're editing an input, just show the form. Otherwise we're dipslaying the entire component to the end user*/}
          {!isEditForm ? (
            <div className="form-editor-froala col-lg registration-col">
              {/* If it's the live page, make sure the froala html sections are not edittable by guests */}
              {isLive ? (
                <FroalaEditorView
                  model={model.sections[sectionIndex].html.replace(
                    `contenteditable="true"`,
                    `contenteditable="false"`
                  )}
                />
              ) : (
                <Froala
                  sectionIndex={sectionIndex}
                  html={model.sections[sectionIndex].html}
                />
              )}
            </div>
          ) : null}
          {isLoading ? (
            <CircularProgress className="margin-auto" />
          ) : (
            <div className="col-lg registration-col">
              {regComplete && !isEditForm ? (
                <div className="margin-auto">
                  <div>Thank you for registering for {event.title}</div>
                  <br />
                  <div>
                    A confirmation email was sent to {emailAddress}. Please
                    check your spam if you don't see it in your inbox.
                  </div>
                </div>
              ) : (
                <div
                  className={
                    "margin-auto" + !isEditForm ? "form-editor-react" : ""
                  }
                >
                  {/* the mandatory div below is copying the classnames from the react-form-builder2 generated components so the styling is the same*/}
                  <div className="form-group">
                    <label>
                      <span>First Name</span>
                      <span className="label-required badge badge-danger">
                        Required
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={handleFirstNameChange}
                    />
                    <label>
                      <span>Last Name</span>
                      <span className="label-required badge badge-danger">
                        Required
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={handleLastNameChange}
                    />
                    <label>
                      <span>Email Address</span>
                      <span className="label-required badge badge-danger">
                        Required
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={emailAddress}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                    />
                    <div className="errorMessage">{emailError}</div>
                  </div>
                  <ReactFormGenerator
                    action_name={registerText || "Register now"}
                    onSubmit={handleSubmit}
                    data={formData}
                    answer_data={prePopulatedValues}
                    className="form-editor-react"
                  />
                  {!isEditForm ? (
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
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Re-send event link modal */}
      <Modal1
        open={openReSendLink}
        onClose={closeReSendLinkModal}
        content={
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
                  Your link to join the event has been sent to the email address
                  you entered.
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
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(RegistrationForm);
