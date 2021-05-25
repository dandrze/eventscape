import React from "react";
import FoldingCube from "./FoldingCube";

import SimpleNavBar from "./simpleNavBar";

export default ({ text }) => {
  return (
    <SimpleNavBar
      content={
        <div className="form-box shadow-border">
          <p>{text}</p>
          <FoldingCube />
        </div>
      }
    />
  );
};
