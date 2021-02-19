import React, { useEffect } from "react";
import FormBuilder from "./FormBuilder";
import StreamSettings from "./StreamSettings";

function DesignBlockSettings({
  reactComponent,
  isReact,
  onClose,
  sectionIndex,
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
      {showRegistrationSettings === true && <FormBuilder />}
    </div>
  );
}

export default DesignBlockSettings;
