import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ResultsChart from "./ResultsChart";

export default ({ results, poll }) => {
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    // set the total number of responses
    var count = 0;
    for (let optionResults of results) {
      count += optionResults.responses;
    }
    setTotalResponses(count);
  }, []);

  const labels = results.map((option) => {
    return option.text;
  });
  const pollData = results.map((option) => {
    return option.responses;
  });

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: pollData,
      },
    ],
  };
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
          {totalResponses} voted
        </label>
      </div>
      <ResultsChart results={results} question={poll.question} />
    </>
  );
};
