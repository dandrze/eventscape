import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { connect } from "react-redux";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";

function RegistrationForm(props) {
  const formData = [
    {
      label: "First Name",
      type: "text",
      name: "firstname",
    },
    {
      label: "Last Name",
      type: "text",
      name: "lastname",
    },
    {
      label: "Email",
      type: "email",
      name: "email",
    },
    {
      label: "Organization",
      type: "text",
      name: "organization",
    },
  ];

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
      <Formik
        initialValues={{ name: "", email: "" }}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form className="reg-form">
          <ul>
            {formData.map((field) => {
              return (
                <div>
                  <label>{field.label}</label>
                  <Field name={field.name} type={field.type} />
                </div>
              );
            })}
          </ul>
          <button type="submit" className="submitButton themeButton">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default RegistrationForm;
