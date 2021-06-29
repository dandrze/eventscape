import React from "react";

export default ({ isAdmin, inApp }) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#b0281c",
        color: "#eaeaea",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        left: "0px",
        position: inApp ? "relative" : "fixed",
        width: "100%",
        top: inApp ? "-20px" : "0px",
        padding: "2px",
      }}
    >
      {isAdmin ? (
        <div style={{ fontWeight: "500", fontSize: "14px" }}>
          Draft Mode: For demo and testing purposes only. Add an{" "}
          <a
            href="https://app.eventscape.io/license"
            style={{ textDecoration: "underline" }}
          >
            Event License
          </a>{" "}
          to remove this message.
        </div>
      ) : (
        <div style={{ fontWeight: "500", fontSize: "14px" }}>
          Draft Mode: For demo and testing purposes only. Contact the event
          owner to add an Event License to remove this message.
        </div>
      )}
    </div>
  );
};
