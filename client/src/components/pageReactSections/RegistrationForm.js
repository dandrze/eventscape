import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ReactFormGenerator } from "../react-form-builder2/lib";
import AlertModal from "../AlertModal";
import "./RegistrationForm.css";
import api from "../../api/server";

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

    setFormData(formData.data.data);
  };

  const handleSubmit = async (values) => {
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
        action_name="Register now"
        onSubmit={handleSubmit}
        data={formData}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps)(RegistrationForm);
