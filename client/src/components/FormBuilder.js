import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import { ReactFormBuilder } from "./react-form-builder2";
import "./react-form-builder2/dist/app.css";
import "./FormBuilder.css";

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
      label: "Placeholder Label",
      field_name: "dropdown_",
      options: [],
    },
    {
      key: "Checkboxes",
      canHaveAnswer: true,
      name: "Checkboxes",
      icon: "far fa-check-square",
      label: "Placeholder Label",
      field_name: "checkboxes_",
      options: [],
    },
    {
      key: "RadioButtons",
      canHaveAnswer: true,
      name: "Multiple Choice",
      icon: "far fa-dot-circle",
      label: "Placeholder Label",
      field_name: "radiobuttons_",
      options: [],
    },
    {
      key: "TextInput",
      canHaveAnswer: true,
      name: "Text Input",
      label: "Placeholder Label",
      icon: "fas fa-font",
      field_name: "text_input_",
    },
    {
      key: "NumberInput",
      canHaveAnswer: true,
      name: "Number Input",
      label: "Placeholder Label",
      icon: "fas fa-plus",
      field_name: "number_input_",
    },
    {
      key: "Image",
      name: "Image",
      label: "",
      icon: "far fa-image",
      field_name: "image_",
      src: "",
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
      label: "Placeholder Label",
      field_name: "date_picker_",
    },
  ];

  return (
    <div className="form-builder-container">
      <ReactFormBuilder saveUrl="/api/form" toolbarItems={items} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(FormBuilder);
