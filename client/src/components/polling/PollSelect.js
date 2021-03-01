import React from "react";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Divider from "@material-ui/core/Divider";

import PollBlock from "./PollBlock";

export default ({ polls, selectedPoll, handleChangeSelectedPoll }) => {
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

  const classes = useStyles();

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
          <PollBlock
            question={selectedPoll.question}
            pollOptions={selectedPoll.PollOptions}
            readOnly={true}
          />
        </>
      ) : null}
    </>
  );
};
