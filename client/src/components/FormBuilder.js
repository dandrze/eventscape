import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";

import * as actions from "../actions";
import { ReactFormBuilder } from "./react-form-builder2/lib";
import "./react-form-builder2/dist/app.css";
import Cancel from "../icons/cancel.svg";
import api from "../api/server";

const FormBuilder = (props) => {
  const items = [
    {
      key: "Header",
      name: "Header Text",
      icon: "fas fa-heading",
      static: true,
      content: "Placeholder Text...",
    },
    {
      key: "Label",
      name: "Label",
      static: true,
      icon: "fas fa-font",
      content: "Placeholder Text...",
    },
    {
      key: "Paragraph",
      name: "Paragraph",
      static: true,
      icon: "fas fa-paragraph",
      content: "Placeholder Text...",
    },
    {
      key: "LineBreak",
      name: "Line Break",
      static: true,
      icon: "fas fa-arrows-alt-h",
    },
    {
      key: "Dropdown",
      canHaveAnswer: true,
      name: "Dropdown",
      icon: "far fa-caret-square-down",
      label: "Dropdown label",
      field_name: "dropdown_",
      options: [],
    },
    {
      key: "Checkboxes",
      canHaveAnswer: true,
      name: "Checkboxes",
      icon: "far fa-check-square",
      label: "Checkboxes Label",
      field_name: "checkboxes_",
      options: [],
    },
    {
      key: "RadioButtons",
      canHaveAnswer: true,
      name: "Multiple Choice",
      icon: "far fa-dot-circle",
      label: "Multiple Choice Label",
      field_name: "radiobuttons_",
      options: [],
    },
    {
      key: "TextInput",
      canHaveAnswer: true,
      name: "Text Input",
      label: "Text Input Label",
      icon: "fas fa-font",
      field_name: "text_input_",
    },
    {
      key: "TextArea",
      canHaveAnswer: true,
      name: "Text Multi-line Input",
      label: "Text Multi-line Input Label",
      icon: "fas fa-text-height",
      field_name: "text_area_",
    },
    {
      key: "NumberInput",
      canHaveAnswer: true,
      name: "Number Input",
      label: "Number Input Label",
      icon: "fas fa-plus",
      field_name: "number_input_",
    },
    {
      key: "DatePicker",
      canDefaultToday: true,
      canReadOnly: true,
      dateFormat: "MM/dd/yyyy",
      timeFormat: "hh:mm aa",
      showTimeSelect: false,
      showTimeSelectOnly: false,
      name: "Date",
      icon: "far fa-calendar-alt",
      label: "Datepicker Label",
      field_name: "date_picker_",
    },
  ];

  const onPost = (data) => {
    api.post("/api/form", { data: data.task_data, event: props.event.id });
  };

  const onLoad = async () => {
    const res = await api.get("/api/form", {
      params: { event: props.event.id },
    });
    return res.data ? res.data : [];
  };

  return (
    <div className="form-builder-container">
      <div className="registration-modal-navbar">
        <div id="form-builder-status">
          Status: <span style={{ color: "green" }}>Saved</span>
        </div>
        <Tooltip title="Close Editor">
          <img
            src={Cancel}
            id="close-form-builder"
            height="24px"
            onClick={props.handleClose}
          ></img>
        </Tooltip>
      </div>
      <ReactFormBuilder onPost={onPost} onLoad={onLoad} toolbarItems={items} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(FormBuilder);
