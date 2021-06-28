import React from "react";
import EventscapeLogo from "../icons/eventscape-logo-eaeaea.svg";

export default (props) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgb(53, 53, 53, 0.8)",
        color: "#eaeaea",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        left: "0px",
        position: "fixed",
        width: "100%",
        zIndex: 999,
        bottom: "0px",
        padding: "0px 60px",
        borderTop: "1px solid grey",
      }}
    >
      <div style={{ margin: "15px 60px" }}>
        <img
          className="eventscape-logo"
          src={EventscapeLogo}
          alt="eventscape-logo"
          height="35px"
        ></img>
      </div>
      <div style={{ fontWeight: "300", fontSize: "1rem" }}>
        For demo and testing purposes only. <br />
        Purchase a license to remove this message.
      </div>
    </div>
  );
};
