import React from "react";
import { Link } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import SimpleNavBar from "./simpleNavBar";

export default () => {
  return (
    <div
      className="form-box shadow-border"
      style={{ width: "80%", marginTop: "20%" }}
    >
      <p>You do not have access to this page.</p>
      <p>
        Please contact the event owner to add you as a collaborator for this
        event.
      </p>
      <Link to="/my-events">
        <button className="Button1" style={{ margin: "auto" }}>
          Go to My Events
        </button>
      </Link>
    </div>
  );
};
