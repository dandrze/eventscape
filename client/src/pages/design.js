import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import CircularProgress from "@material-ui/core/CircularProgress";

import NavBar3 from "../components/navBar3.js";
import PageEditor from "../components/pageEditor";
import "../components/fonts.css";
import { pageNames } from "../model/enums";

const Design = (props) => {
  useEffect(() => {
    const modelId =
      props.settings.nowEditingPage === pageNames.REGISTRATION
        ? props.event.reg_page_model
        : props.event.event_page_model;
    props.fetchModel(modelId);
  }, [props.event, props.settings.nowEditingPage]);

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        content={
          props.settings.loaded ? (
            <PageEditor key={props.model} />
          ) : (
            <CircularProgress />
          )
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { event: state.event, model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Design);
