import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import api from "../../api/server";
import ResultsChart from "./ResultsChart";

import * as actions from "../../actions";

const PollInProgress = ({
  polling: { selectedPollIndex, polls, results, totalResponded },
  fetchPollResults,
  event,
}) => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    // fetch the response results
    fetchPollResults();
    fetchTotalVisitors();

    // fetch the results after 3 seconds and every 3 seconds
    const interval = setInterval(() => {
      fetchPollResults();
    }, 3000);

    // clear the interval upon unmount
    return () => clearInterval(interval);
  }, []);

  // Create a timer that updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((secondsElapsed) => secondsElapsed + 1);
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearInterval(timer);
  }, []);

  const fetchTotalVisitors = async () => {
    // get the total number of visitors

    const currentVisitorsRes = await api.get("api/analytics/current-visitors", {
      params: { eventId: event.id },
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
          {totalResponded} of {totalVisitors} (
          {totalVisitors
            ? Math.round((totalResponded / totalVisitors) * 100) + "%"
            : "Error"}
          ) voted
        </label>
      </div>
      <ResultsChart
        results={results}
        question={polls[selectedPollIndex].question}
        allowMultiple={polls[selectedPollIndex].allowMultiple}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return { polling: state.polling, event: state.event };
};

export default connect(mapStateToProps, actions)(PollInProgress);
