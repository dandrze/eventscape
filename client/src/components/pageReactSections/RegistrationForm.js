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

  const handleSubmit = async (values) => {
    // If there is a custom callback (i.e. editting a registration) use that
    if (props.onSubmitCallback) {
      props.onSubmitCallback(values);
    } else {
      // else use the default workflow
      const res = await props.addRegistration(props.event.id, values);
      if (res) {
        setModalText("Thank you for registering for " + props.event.title);
        openModal();
      }
    }
  };

  const model = `<div class="one" contenteditable="true">
  <p style="margin-top: 0;"><strong><span style="font-size: 30px; text-align: left;">Register For Event</span></strong></p>
  <p style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>`;

  const theme = `
  .form-editor-froala {
    margin: 5%;
    text-align: justify;
}

.form-editor-react  {
    padding: 8%;
    margin: 5%;
    background-color: #EFEFEF;
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
        <div className="form-editor-froala">
          <Froala sectionIndex={props.sectionIndex} />
        </div>
        <div className="form-editor-react">
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
