import React from "react";
import { Link } from "react-router-dom";

import FoldingCube from "./FoldingCube";

import SimpleNavBar from "./simpleNavBar";

export default ({ message }) => {
  return (
    <div
      className="form-box shadow-border"
      style={{ width: "80%", marginTop: "20%" }}
    >
      <p>You do not have access to this page.</p>
      <p>{message}</p>
      <Link to="/my-events">
        <button className="Button1" style={{ margin: "auto" }}>
          Go to My Events
        </button>
      </Link>
    </div>
  );
};
