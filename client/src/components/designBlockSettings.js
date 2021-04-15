import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import FormBuilder from "./FormBuilder";
import StreamSettings from "./StreamSettings";


function DesignBlockSettings({
  reactComponent,
  isReact,
  onClose,
  sectionIndex,
  event,
  history
}) {
  // set required settings based on design block name:
  const showStreamChatSettings = isReact && reactComponent.name == "StreamChat";
  
  const showRegistrationSettings =
    isReact && reactComponent.name == "RegistrationForm";

    

  const handleClose = () => {
    onClose();
  };



 

  return (
    <div>
      {showStreamChatSettings === true && (
        <StreamSettings
          handleClose={handleClose}
          reactComponent={reactComponent}
          sectionIndex={sectionIndex}
        />
      )}
      {showRegistrationSettings === true &&  <FormBuilder />}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    event: state.event,
  };
};

export default connect(mapStateToProps)(withRouter(DesignBlockSettings));

