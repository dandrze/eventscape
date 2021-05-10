import React from "react";
import "./BrandingTop.css";

// Icons:
import EventscapeLogo from "../icons/eventscape-logo-d1d1d1.svg";

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
        Create your own event page
      </a>
    </div>
  );
}
