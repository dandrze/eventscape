import React from "react";
import { AddBox, Edit, List, SaveAlt } from "@material-ui/icons";

export default ({ label, type }) => {
  return (
    <div>
      {type === "add" ? (
        <AddBox style={{ color: "#b0281c" }} />
      ) : type === "data" ? (
        <List style={{ color: "#b0281c" }} />
      ) : type === "export" ? (
        <SaveAlt style={{ color: "#b0281c" }} />
      ) : type === "edit" ? (
        <Edit style={{ color: "#b0281c" }} />
      ) : null}
      <span style={{ fontSize: "16px", margin: "0px 5px", color: "#b0281c" }}>
        {label}
      </span>
    </div>
  );
};
