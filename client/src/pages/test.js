import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import { ReactFormGenerator } from "../components/react-form-builder2/lib";
import "./test.css";
import api from "../api/server";
import ErrorScreen from "../components/ErrorScreen";

const Test = (props) => {
  return <ErrorScreen />;
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event };
};

export default connect(mapStateToProps, actions)(Test);
