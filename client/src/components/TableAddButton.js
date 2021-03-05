import React from "react";
import AddBox from "@material-ui/icons/AddBox";

export default ({ label }) => {
  return (
    <div>
      <AddBox />
      <span style={{ fontSize: "16px", margin: "0px 5px" }}>{label}</span>
    </div>
  );
};
