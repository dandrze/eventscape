import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import { ReactFormGenerator } from "../components/react-form-builder2/lib";
import "./test.css";
import api from "../api/server";

const Test = (props) => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    fetchFormData();
  }, []);
  const items = [
    {
      key: "Header",
      name: "Header Text",
      icon: "fa fa-header",
      static: true,
      content: "Placeholder Text...",
    },
    {
      key: "Paragraph",
      name: "Paragraph",
      static: true,
      icon: "fa fa-paragraph",
      content: "Placeholder Text...",
    },
  ];

  const fetchFormData = async () => {
    const formData = await api.get("/api/form", {
      params: { event: 136 },
    });

    setFormData(formData.data.data);
  };

  return (
    <ReactFormGenerator
      form_action="/api/registration"
      form_method="POST"
      data={formData}
    />
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(Test);
