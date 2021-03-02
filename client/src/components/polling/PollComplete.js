import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ResultsChart from "./ResultsChart";

export default ({ poll, results, totalResponded }) => {
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <CheckCircleIcon style={{ margin: "12px", color: "#28a745" }} />
        <h2>Poll Complete</h2>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          padding: "12px",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          marginBottom: "2rem",
        }}
      >
        <label style={{ marginBottom: "0px" }}>Poll closed</label>
        <label style={{ marginLeft: "auto", marginBottom: "0px" }}>
          {totalResponded} voted
        </label>
      </div>
      <ResultsChart results={results} question={poll.question} />
    </>
  );
};
