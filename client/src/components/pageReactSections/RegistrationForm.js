import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

import { ReactFormGenerator } from "../react-form-builder2/lib";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";
import api from "../../api/server";
import * as actions from "../../actions";
import Froala from "../froala";

function RegistrationForm(props) {
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState(false);
  const [formData, setFormData] = useState([]);
  const [emailAddress, setEmailAddress] = useState(
    props.standardFields ? props.standardFields.email : ""
  );
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState(
    props.standardFields ? props.standardFields.firstName : ""
  );
  const [lastName, setLastName] = useState(
    props.standardFields ? props.standardFields.lastName : ""
  );

  console.log(props.sectionIndex);

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
    } else {
      // If there is a custom callback (i.e. editting a registration) use that
      if (props.onSubmitCallback) {
        props.onSubmitCallback(values, emailAddress, firstName, lastName);
      } else {
        // else use the default workflow
        const res = await props.addRegistration(
          props.event.id,
          values,
          emailAddress,
          firstName,
          lastName
        );
        if (res) {
          setModalText("Thank you for registering for " + props.event.title);
          openModal();
        }
      }
    }
  };

  const validateEmailFormat = (inputText) => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return inputText.value.match(mailformat);
  };

  const theme = `
  .form-editor-froala {
    margin: 8%;
    text-align: justify;
  }

  .form-editor-react  {
      margin: 8%;
      background-color: #FFF; //was #EFEFEF
  }

  .container {
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 1rem;
  }
  `;

  return (
    <div>
      <style>{theme}</style>
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
            <Froala sectionIndex={props.sectionIndex} />
          </div>
        ) : null}
        {/* if we're editing an input, don't add the classname that includes all the styling*/}
        <div className={!props.isEditForm ? "form-editor-react" : ""}>
          {/* the mandatory div below is copying the classnames from the react-form-builder2 generated components so the styling is the same*/}
          <div className="form-group">
            <label>
              <span>Email Address</span>
              <span class="label-required badge badge-danger">Required</span>
            </label>
            <input
              type="text"
              class="form-control"
              value={emailAddress}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
            <div className="errorMessage">{emailError}</div>
            <label>
              <span>First Name</span>
              <span class="label-required badge badge-danger">Required</span>
            </label>
            <input
              type="text"
              class="form-control"
              value={firstName}
              onChange={handleFirstNameChange}
            />
            <label>
              <span>Last Name</span>
              <span class="label-required badge badge-danger">Required</span>
            </label>
            <input
              type="text"
              class="form-control"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </div>
          <ReactFormGenerator
            action_name={props.registerText || "Register now"}
            onSubmit={handleSubmit}
            data={formData}
            answer_data={props.prePopulatedValues}
            className="form-editor-react"
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(RegistrationForm);
