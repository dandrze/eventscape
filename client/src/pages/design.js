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
    // only fetch the model if the event data is finished fetching. Otherwise it is an empty obect
    if (Object.keys(props.event).length != 0) {
      const modelId =
        props.settings.nowEditingPage === pageNames.REGISTRATION
          ? props.event.RegPageModelId
          : props.event.EventPageModelId;

      props.fetchModel(modelId);
    }
  }, [props.event, props.settings.nowEditingPage]);

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        highlight="design"
        content={
          props.model.sections.length ? (
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
