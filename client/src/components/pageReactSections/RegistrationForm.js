import React, { useState } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";
import api from "../../api/server";

function RegistrationForm(props) {
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState(false);

  const formData = [
    {
      label: "First Name",
      type: "text",
      name: "firstName",
    },
    {
      label: "Last Name",
      type: "text",
      name: "lastName",
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
    {
      label: "check label",
      type: "checkbox",
      name: "optin",
    },
    {
      label: "radio label 1",
      type: "radio",
      name: "radio1",
    },
    {
      label: "radio label 2",
      type: "radio",
      name: "radio2",
    },
  ];

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

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
      <Formik
        initialValues={{ name: "", email: "" }}
        onSubmit={async (values) => {
          alert(JSON.stringify(values, null, 2));
          /*try {
            const res = await api.post("/api/registration", {
              ...values,
              event: props.event.id,
            });
            setModalText("Thank you for registering for " + props.event.title);
            openModal();
          } catch (err) {
            setModalText(err.toString());
            openModal();
          }
          */
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

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps)(RegistrationForm);
