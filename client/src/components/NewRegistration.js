import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

import { ReactFormGenerator } from "./react-form-builder2/lib";
import AlertModal from "./AlertModal";
import "./NewRegistration.css";
import api from "../api/server";
import * as actions from "../actions";

import { makeStyles } from "@material-ui/core/styles";

import { isValidEmailFormat } from "../hooks/validation";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
}));

function RegistrationForm({
  event,
  standardFields,
  onSubmitCallback,
  fetchRegistration,
  prePopulatedValues,
  addRegistration,
  isEditRegistration,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState(false);
  const [formData, setFormData] = useState([]);
  const [emailAddress, setEmailAddress] = useState(
    standardFields ? standardFields.email : ""
  );
  const [emailAddressReSend, setEmailAddressReSend] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState(
    standardFields ? standardFields.firstName : ""
  );
  const [lastName, setLastName] = useState(
    standardFields ? standardFields.lastName : ""
  );

  useEffect(() => {
    fetchFormData();
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
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
        // else use the default workflow
        const res = await addRegistration(
          event.id,
          values,
          emailAddress,
          firstName,
          lastName
        );
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
      <div
        className="registration-section"
        style={{ margin: "auto", padding: "0px 10px" }}
      >
        <div className="col-lg registration-column">
          <div>
            {/* the mandatory div below is copying the classnames from the react-form-builder2 generated components so the styling is the same*/}
            <div className="form-group" style={{ minWidth: "300px" }}>
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
              action_name={isEditRegistration ? "Save" : "Submit*"}
              onSubmit={handleSubmit}
              data={formData}
              answer_data={prePopulatedValues}
              className="form-editor-react"
            />
            {!isEditRegistration ? (
              <label style={{ marginTop: "15px" }}>
                * When the submit button is pressed, the new registrant will
                receive a registration confirmation email.
              </label>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(RegistrationForm);
