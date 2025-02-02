import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const PollBlock = ({
  question,
  readOnly,
  submitPoll,
  pollOptions,
  allowMultiple,
}) => {
  // checked state keeps track of selection if multiple multiple selections are allowed
  const [checked, setChecked] = React.useState([]);
  // selectedIndex keeps track of the single selection if multiple selections are not allowed. It starts with -1 to ensure no radio boxes are checked
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [errorText, setErrorText] = useState("");

  const handleChangeCheckbox = (event, index) => {
    const _checked = checked;
    _checked[index] = event.target.checked;
    setChecked(_checked);
    setErrorText("");
  };

  const handleChangeRadio = (event) => {
    setSelectedIndex(event.target.value);
    setErrorText("");
  };

  const handleSubmitPoll = () => {
    if (allowMultiple) {
      // extract all the selected options based on the array of which checkboxes have been checked
      const selectedOptions = pollOptions.filter(
        (pollOption, index) => checked[index]
      );
      // if no option is selected, display an alert and end the function
      if (selectedOptions.length === 0) {
        return setErrorText("Select at least one option");
      }

      // send the array to the server
      submitPoll(selectedOptions);
    } else {
      // extract the selected option based on the index of the clicked radio button
      const selectedOption = pollOptions[selectedIndex];

      // if no option is selected, display an alert and end the function
      if (!selectedOption) {
        return setErrorText("Select at least one option");
      }

      // submit an array of 1
      // backend server expects an array to iterate through
      submitPoll([selectedOption]);
    }
  };

  return (
    <>
      {/* Previews the selected poll question*/}
      <h5>{question}</h5>
      {errorText ? (
        <div style={{ color: "red", marginBottom: "0.5rem" }}>{errorText}</div>
      ) : null}
      {/* Previews the selected polls options. If multiple answers are allowed, then we display checkboxes, otherwise we display radio buttons*/}
      <div>
        {allowMultiple ? (
          pollOptions.map((option, index) => {
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
          })
        ) : (
          <RadioGroup
            value={selectedIndex.toString()}
            onChange={handleChangeRadio}
          >
            {pollOptions.map((option, index) => {
              return (
                <FormControlLabel
                  control={<Radio />}
                  label={option.text}
                  value={index.toString()}
                  style={{ width: "100%" }}
                />
              );
            })}
          </RadioGroup>
        )}
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
