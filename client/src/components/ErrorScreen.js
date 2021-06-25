import React from "react";

import FoldingCube from "./FoldingCube";

import SimpleNavBar from "./simpleNavBar";

export default (props) => {
  const handleGoHome = (event) => {
    event.preventDefault();
    window.location.replace("/");
  };
  return (
    <SimpleNavBar
      content={
        <div className="form-box shadow-border">
          <p>Something went wrong...</p>
          <p>Let's get you back home.</p>

          <button
            onClick={handleGoHome}
            className="Button1"
            style={{ margin: "auto" }}
          >
            Back to home
          </button>
        </div>
      }
    />
  );
};
