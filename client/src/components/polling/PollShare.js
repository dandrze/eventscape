import React, { useEffect, useState } from "react";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ResultsChart from "./ResultsChart";

export default ({ poll, results }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Create a timer that updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      console.log();
      setSecondsElapsed((secondsElapsed) => secondsElapsed + 1);
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <PlayCircleFilledIcon style={{ margin: "12px", color: "#28a745" }} />
        <h2>Sharing Results</h2>
        <h2 style={{ marginLeft: "auto" }}>
          {Math.floor(secondsElapsed / 60)}:
          {(secondsElapsed % 60).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}
        </h2>
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
        <label style={{ marginBottom: "0px" }}>
          Attendees are now viewing results
        </label>
      </div>
      {/* Previews the selected poll question*/}
      <ResultsChart results={results} question={poll.question} />
    </>
  );
};
