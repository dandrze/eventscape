import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import FoldingCube from "./FoldingCube";

export default () => {
  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center" }}>
      <FoldingCube />
    </div>
  );
};
