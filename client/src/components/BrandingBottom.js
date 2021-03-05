import React from "react";
import "./BrandingBottom.css";

// Icons:
import EventscapeLogo from "../icons/eventscape-logo-black.svg";

export default function BrandingBottom(props) {
  return (
    <div className="branding-bottom-container">
      <a href="https://app.eventscape.io/create-account" style={{ margin: "0 auto" }}>
        <p className="powered-by">Powered by Eventscape</p>
      </a>
    </div>
  );
}
