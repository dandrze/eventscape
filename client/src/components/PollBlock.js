import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

const PollBlock = ({
  question,
  readOnly,
  submitPoll,
  closePoll,
  pollOptions,
}) => {
  // Make a local state of the options
  const [options, setOptions] = useState(pollOptions);

  const handleChangeCheckbox = (event, index) => {
    if (!readOnly) {
      const _options = [...options];
      // add the checked flag to the selected option
      _options[index].checked = true;
      setOptions(_options);
    }
  };

  const handleSubmitPoll = () => {
    const selectedOptions = options.filter((option) => option.checked);
    console.log(selectedOptions);
    submitPoll(selectedOptions);
  };

  return (
    <>
      {/* Previews the selected poll question*/}
      <h5>{question}</h5>
      {/* Previews the selected polls options. If multiple answers are allowed, then we display checkboxes, otherwise we display radio buttons*/}
      <div>
        {options.map((option, index) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={options[index].checked}
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
