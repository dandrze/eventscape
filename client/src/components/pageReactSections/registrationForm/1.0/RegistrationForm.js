import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import { ReactFormGenerator } from "../../../react-form-builder2/lib";
import AlertModal from "../../../AlertModal";
import "./RegistrationForm.css";
import api from "../../../../api/server";
import * as actions from "../../../../actions";
import Froala from "../../../froala";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Modal1 from "../../../Modal1";
import FoldingCube from "../../../FoldingCube";

import { isValidEmailFormat } from "../../../../hooks/validation";

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
  SubmitButtonText,
  prePopulatedValues,
  sectionIndex,
  addRegistration,
  resendRegistrationEmail,
  isLive,
  isManualEntry,
  isEditRegistration,
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
  const [displayEditMessage, setDisplayEditMessage] = useState(false);
  const [backgroundBoxShadow, setBackgroundBoxShadow] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    fetchFormData();
  }, [settings.triggerSectionReactUpdate]);

  useEffect(() => {
    if (!isManualEntry) getBackgroundStyle();
  }, [model.sections[sectionIndex]]);

  const getBackgroundStyle = () => {
    let pageHtml = document.createElement("div");
    pageHtml.innerHTML = model.sections[sectionIndex].html;

    let backgroundDiv = pageHtml.getElementsByTagName("div")[2];

    if (backgroundDiv) {
      setBackgroundBoxShadow(backgroundDiv.style.boxShadow);
      setBackgroundImage(backgroundDiv.style.backgroundImage);
    }
  };

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
    setEmailError(
      isValidEmailFormat(emailAddress)
        ? ""
        : "Please enter a valid email address"
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
      !isEditRegistration &&
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
    if (!emailAddressReSend || !isValidEmailFormat(emailAddressReSend)) {
      setEmailErrorText("Please enter valid email address");
    } else {
      const registration = await fetchRegistration(
        emailAddressReSend,
        event.id
      );

      if (registration && registration.emailAddress == emailAddressReSend) {
        setEmailFound(true);
        setEmailNotFound(false);
        await resendRegistrationEmail(emailAddressReSend, event.id);
      } else {
        setEmailNotFound(true);
        setEmailFound(false);
      }
    }
  };

  console.log(backgroundBoxShadow);

  return (
    <div>
      <AlertModal
        open={open}
        onClose={closeModal}
        onContinue={closeModal}
        content={modalText}
        continueText="OK"
      />
      <div
        className="registration-section"
        style={{ margin: "auto", padding: "0px 10px" }}
      >
        {/* if we're editing an input, just show the form. Otherwise we're dipslaying the entire component to the end user*/}
        {!isManualEntry ? (
          <div className="col-lg registration-description registration-column">
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

        <div className="col-lg registration-column">
          <div
            style={{
              boxShadow: backgroundBoxShadow,
              background: "#ffffff",
              backgroundImage,
              backgroundPosition: "center bottom",
              backgroundSize: "cover",
              borderRadius: "10px",
              padding: "calc(15px + 1.5vw)",
              height: "100%",
            }}
          >
            {isLoading ? (
              <FoldingCube className="margin-auto" />
            ) : regComplete && !isManualEntry ? (
              <div className="margin-auto">
                <p>Thank you for registering for {event.title}</p>
                <br />
                <p>
                  A confirmation email was sent to {emailAddress}. Please check
                  your spam if you don't see it in your inbox.
                </p>
              </div>
            ) : (
              <div
                className={`margin-auto ${
                  !isManualEntry ? "form-editor-react" : ""
                }`}
                style={{ minWidth: "350px" }}
                onMouseEnter={() => setDisplayEditMessage(true)}
                onMouseLeave={() => setDisplayEditMessage(false)}
              >
                {!isLive && !isManualEntry && displayEditMessage ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      height: "100%",
                      background: "rgba(1,1,1,0.4)",
                      color: "#fff",
                      padding: "86px 40px",
                    }}
                  >
                    Click the gears in the top left of the section to edit the
                    registration form.
                  </div>
                ) : null}
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
                  action_name={SubmitButtonText || "Register now"}
                  onSubmit={handleSubmit}
                  data={
                 formData
                  }
                  answer_data={prePopulatedValues}
                  className="form-editor-react"
                />

                {!isManualEntry ? (
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
