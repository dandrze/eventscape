import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import SimpleNavBar from "./simpleNavBar"

export default ({ text }) => {
  return (
    <SimpleNavBar
        content={
    <div className="form-box shadow-border">
      <p>{text}</p>
      <CircularProgress />
    </div>} />
  );
};
