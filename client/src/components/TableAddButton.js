import React from "react";
import AddBox from "@material-ui/icons/AddBox";

export default ({ label }) => {
  return (
    <div>
      <AddBox style={{ color: "#b0281c" }} />
      <span style={{ fontSize: "16px", margin: "0px 5px", color: "#b0281c" }}>
        {label}
      </span>
    </div>
  );
};
