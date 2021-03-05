import React from "react";
import "./BrandingTop.css";

// Icons:
import EventscapeLogo from "../icons/eventscape-logo-black.svg";

export default function BrandingTop(props) {
  return (
    <div className="branding-top-container">
          <img
            className="eventscape-logo"
            src={EventscapeLogo}
            alt="eventscape-logo"
            height="35px"
          ></img>
          <a href="https://app.eventscape.io/create-account" style={{ marginLeft: "auto", fontSize: "18px" }} className="link1" >
              Create event website
          </a>
    </div>
  );
}
