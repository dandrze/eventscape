import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";

import ResultsChart from "./ResultsChart";
import * as actions from "../../actions";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  addOption: {
    cursor: "pointer",
    color: "#b0281c",
  },
  removeOption: { margin: "10px", cursor: "pointer", color: "#b0281c" },
  divider: { marginTop: "10px", marginBottom: "30px" },
}));

const PollSelect = ({
  polling: { selectedPollIndex, polls, results, totalResponded },
  selectPollByIndex,
  fetchPollResults,
}) => {
  const classes = useStyles();

  useEffect(() => {
    // each time we select a new poll, update the redux state with that polls results
    if (polls[selectedPollIndex]) fetchPollResults();
  }, [polls[selectedPollIndex]]);

  const handleChangeSelectedPoll = (event) => {
    selectPollByIndex(event.target.value);
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="select-poll-label">Select Poll</InputLabel>
        <Select
          labelId="select-poll-label"
          value={selectedPollIndex}
          onChange={handleChangeSelectedPoll}
          label="Select Poll"
        >
          {polls.map((poll, index) => {
            return <MenuItem value={index}>{poll.question}</MenuItem>;
          })}
        </Select>
      </FormControl>
      {polls[selectedPollIndex] ? (
        <>
          <Divider className={classes.divider} variant="middle" />
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
            {totalResponded ? (
              <>
                <label style={{ marginBottom: "0px" }}>Poll complete</label>
                <label style={{ marginLeft: "auto", marginBottom: "0px" }}>
                  {totalResponded} voted
                </label>
              </>
            ) : (
              <label style={{ marginBottom: "0px" }}>
                Poll not launched yet
              </label>
            )}
          </div>

          
            <ResultsChart
              question={polls[selectedPollIndex].question}
              results={results}
              allowMultiple={polls[selectedPollIndex].allowMultiple}
            />
          
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  return { polling: state.polling, event: state.event };
};

export default connect(mapStateToProps, actions)(PollSelect);
