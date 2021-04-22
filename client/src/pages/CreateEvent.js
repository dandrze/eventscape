import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import SimpleNavBar from "../components/simpleNavBar";
import EventDetailsForm from "../components/EventDetailsForm";
import SelectEventType from "../components/SelectEventType";

import * as actions from "../actions";

function CreateEvent(props) {
  const [eventType, setEventType] = useState("");
  const [step, setStep] = useState("type");

  const handleContinue = (type) => {
    window.scrollTo(0, 0);
    setEventType(type);
    setStep("details");
  };

  return (
    <SimpleNavBar
      content={
        <div style={{ alignSelf: "baseline" }}>
          {step === "type" ? (
            <SelectEventType handleContinue={handleContinue} />
          ) : (
            <EventDetailsForm eventType={eventType} />
          )}
        </div>
      }
    />
  );
}

export default connect(null, actions)(CreateEvent);
