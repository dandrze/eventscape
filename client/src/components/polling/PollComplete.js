import React from "react";
import { connect } from "react-redux";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ResultsChart from "./ResultsChart";
import * as actions from "../../actions";

const PollComplete = ({
  polling: { selectedPollIndex, polls, results, totalResponded },
}) => {
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

export default connect(mapStateToProps, actions)(PollComplete);
