import React from "react";
import "./BrandingTop.css";

// Icons:
import EventscapeLogo from "../icons/eventscape-logo-929292.svg";

export default function BrandingTop(props) {
  return (
    <div className="branding-top-container">
      <a href="https://eventscape.io">
        <img
          className="eventscape-logo"
          src={EventscapeLogo}
          alt="eventscape-logo"
          height="35px"
        ></img>
      </a>
      <a
        href="https://app.eventscape.io/signup"
        style={{ marginLeft: "auto", fontSize: "16px" }}
        className="branding-button"
      >
        Create Event
      </a>
    </div>
  );
}
