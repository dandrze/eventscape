import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import SimpleNavBar from "../components/simpleNavBar";
import EventDetailsForm from "../components/EventDetailsForm";

import * as actions from "../actions";

function CreateEvent(props) {
  return (
    <SimpleNavBar
      content={
        <div style={{ alignSelf: "baseline" }}>
          <EventDetailsForm />
        </div>
      }
    />
  );
}

export default connect(null, actions)(CreateEvent);
