import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";

import api from "../../api/server";
import ResultsChart from "./ResultsChart";

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

export default ({ polls, selectedPoll, handleChangeSelectedPoll }) => {
  const [results, setResults] = useState([]);
  const [totalResponded, setTotalResponded] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    if (selectedPoll) fetchResults();
  }, [selectedPoll]);

  const fetchResults = async () => {
    const resultsRes = await api.get("/api/polling/results", {
      params: { pollId: selectedPoll.id },
    });
    console.log(resultsRes);

    const { results, totalResponded } = resultsRes.data;

    // set results to the new poll option with responses added to it
    setResults(results);

    setTotalResponded(totalResponded);
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="select-poll-label">Select Poll</InputLabel>
        <Select
          labelId="select-poll-label"
          value={selectedPoll}
          onChange={handleChangeSelectedPoll}
          label="Select Poll"
        >
          {polls.map((poll) => {
            return <MenuItem value={poll}>{poll.question}</MenuItem>;
          })}
        </Select>
      </FormControl>
      {selectedPoll ? (
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

          {results ? (
            <ResultsChart
              question={selectedPoll.question}
              results={results}
              allowMultiple={selectedPoll.allowMultiple}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};
