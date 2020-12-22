import React, { useState, useEffect } from "react";
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
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = async (values) => {
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
            />
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
