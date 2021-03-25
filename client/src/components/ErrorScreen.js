import React from "react";
import { Link } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import SimpleNavBar from "./simpleNavBar";

export default () => {
  return (
    <SimpleNavBar
      content={
        <div className="form-box shadow-border">
          <p>Oops there was an error.</p>
          <p>Let's get you back home.</p>
          <Link to="/">
            <button className="Button1" style={{ margin: "auto" }}>
              Back to home
            </button>
          </Link>
        </div>
      }
    />
  );
};
