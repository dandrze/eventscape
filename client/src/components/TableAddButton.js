import React from "react";
import AddBox from "@material-ui/icons/AddBox";
import ListIcon from "@material-ui/icons/List";

export default ({ label, type }) => {
  return (
    <div>
      {type === "add" ? (
        <AddBox style={{ color: "#b0281c" }} />
      ) : type === "data" ? (
        <ListIcon style={{ color: "#b0281c" }} />
      ) : null}
      <span style={{ fontSize: "16px", margin: "0px 5px", color: "#b0281c" }}>
        {label}
      </span>
    </div>
  );
};
