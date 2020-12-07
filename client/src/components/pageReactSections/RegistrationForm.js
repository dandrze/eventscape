import React, { useState } from "react";
import { connect } from "react-redux";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";

function RegistrationForm(props) {
  const { formData } = props;
  return (
    <div>
      {/*<AlertModal
        open={openModal}
        onClose={closeModal}
        onContinue={closeModal}
        text={modalText}
        closeText="Cancel"
        continueText="OK"
      />*/}
      <h1>My Event Details</h1>
      <form action="/login" method="post">
        <ul>
          {formData.map((field) => {
            return (
              <div>
                <label>{field.label}</label>
                <input type={field.type} name={field.name} />
              </div>
            );
          })}
        </ul>
        <div>
          <input type="submit" value="Register Now" />
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
