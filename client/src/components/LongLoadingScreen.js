import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import SimpleNavBar from "./simpleNavBar";
import FoldingCube from "./FoldingCube";

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
