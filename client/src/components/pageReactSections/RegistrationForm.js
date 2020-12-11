import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ReactFormGenerator } from "../react-form-builder2/lib";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";
import api from "../../api/server";
import * as actions from "../../actions";

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
      params: { event: 136 },
    });

    setFormData(formData.data);
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
      <ReactFormGenerator
        action_name={props.registerText || "Register now"}
        onSubmit={handleSubmit}
        data={formData}
        answer_data={props.prePopulatedValues}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, actions)(RegistrationForm);
