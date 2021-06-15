import React from "react";
import { ReactComponent as ViewIcon } from "../icons/view2.svg";
import { ReactComponent as CodeIcon } from "../icons/code.svg";
import { ReactComponent as BackgroundIcon } from "../icons/background.svg";
import { ReactComponent as CancelIcon } from "../icons/cancel.svg";
import CachedIcon from "@material-ui/icons/Cached";

export default ({ label, icon, onClick, horizontal }) => {
  return (
    <div
      className="icon-button"
      style={{ flexDirection: horizontal ? "row" : "column" }}
      onClick={onClick}
    >
      {icon === "visibility" ? (
        <ViewIcon fill="#b0281c" style={{ width: "40px" }} />
      ) : icon === "background" ? (
        <BackgroundIcon fill="#b0281c" style={{ width: "30px" }} />
      ) : icon === "code" ? (
        <CodeIcon fill="#b0281c" style={{ width: "30px", height: "26px" }} />
      ) : icon === "refresh" ? (
        <CachedIcon color="primary" style={{ fontSize: "25px" }} />
      ) : icon === "cancel" ? (
        <CancelIcon fill="#b0281c" style={{ height: "18px", margin: "4px" }} />
      ) : null}
      <p
        style={{
          fontSize: "10px",
          fontWeight: "600",
          margin: "0px 5px 0px",
          color: "#b0281c",
        }}
      >
        {label}
      </p>
    </div>
  );
};
