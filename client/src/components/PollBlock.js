import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

const PollBlock = ({ question, readOnly, submitPoll, pollOptions }) => {
  // Make a local state of the options
  const [checked, setChecked] = React.useState([]);

  const handleChangeCheckbox = (event, index) => {
    const _checked = checked;
    _checked[index] = event.target.checked;
    setChecked(_checked);
  };

  const handleSubmitPoll = () => {
    const selectedOptions = pollOptions.filter(
      (pollOption, index) => checked[index]
    );

    submitPoll(selectedOptions);
  };

  return (
    <>
      {/* Previews the selected poll question*/}
      <h5>{question}</h5>
      {/* Previews the selected polls options. If multiple answers are allowed, then we display checkboxes, otherwise we display radio buttons*/}
      <div>
        {pollOptions.map((option, index) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked[index]}
                  onChange={(event) => handleChangeCheckbox(event, index)}
                  color="primary"
                />
              }
              label={option.text}
              style={{ width: "100%" }}
            />
          );
        })}
      </div>
      {readOnly ? null : (
        <FormControl
          variant="outlined"
          style={{
            margin: "20px 0px",
            minWidth: "100%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitPoll}
            class="Button1"
            style={{ width: "150px", alignSelf: "flex-end" }}
          >
            Submit
          </Button>
        </FormControl>
      )}
    </>
  );
};

export default PollBlock;
