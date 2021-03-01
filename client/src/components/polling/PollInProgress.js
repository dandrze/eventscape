import React, { useEffect, useState } from "react";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import api from "../../api/server";
import ResultsChart from "./ResultsChart";

export default ({ poll, eventId, results, setResults }) => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    // fetch the response results
    fetchResults();

    // fetch the results after 3 seconds and every 3 seconds
    const interval = setInterval(() => {
      fetchResults();
    }, 3000);

    // clear the interval upon unmount
    return () => clearInterval(interval);
  }, []);

  // Create a timer that updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      console.log();
      setSecondsElapsed((secondsElapsed) => secondsElapsed + 1);
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearInterval(timer);
  }, []);

  const fetchResults = async () => {
    const resultsRes = await api.get("/api/polling/results", {
      params: { pollId: poll.id },
    });

    // set results to the new poll option with responses added to it
    setResults(resultsRes.data);

    // set the total number of responses
    var count = 0;
    for (let result of resultsRes.data) {
      count += result.responses;
    }
    setTotalResponses(count);

    // get the total number of visitors

    const currentVisitorsRes = await api.get("api/analytics/current-visitors", {
      params: { eventId },
    });
    setTotalVisitors(currentVisitorsRes.data.currentVisitors);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <RadioButtonCheckedIcon style={{ margin: "12px", color: "#28a745" }} />
        <h2>Poll in Progress</h2>
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
          Attendees are now viewing question
        </label>
        <label style={{ marginLeft: "auto", marginBottom: "0px" }}>
          {totalResponses} of {totalVisitors} (
          {totalVisitors
            ? Math.round((totalResponses / totalVisitors) * 100) + "%"
            : "Error"}
          ) voted
        </label>
      </div>
      <ResultsChart results={results} question={poll.question} />
    </>
  );
};
