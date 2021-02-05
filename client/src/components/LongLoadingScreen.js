import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default ({ text }) => {
  return (
    <div className="form-box shadow-border">
      <p>{text}</p>
      <CircularProgress />
    </div>
  );
};
