import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Switch from "../switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import AlertModal from "../AlertModal";

import * as actions from "../../actions";
import api from "../../api/server";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  optionsContainer: {
    paddingRight: "20px",
    paddingTop: "20px",
  },
  optionContainer: {
    display: "flex",
    alignItems: "center",
  },
  addOption: {
    cursor: "pointer",
    color: "#b0281c",
  },
  removeOption: { margin: "10px", cursor: "pointer", color: "#b0281c" },
}));

const PollBuilder = ({ handleClose, event, pollData, isAdd }) => {
  const classes = useStyles();

  const [question, setQuestion] = useState(isAdd ? "" : pollData.question);
  const [options, setOptions] = useState(
    isAdd ? [{ text: "" }, { text: "" }] : pollData.PollOptions
  );
  const [allowMultiple, setAllowMultiple] = useState(
    isAdd ? false : pollData.allowMultiple
  );
  //const [allowShare, setAllowShare] = useState(isAdd ? false : pollData.allowShare);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleChangeQuestion = (event) => {
    setQuestion(event.target.value);
  };

  const handleChangeOptions = (event, index) => {
    const newValue = event.target.value;
    setOptions((options) =>
      options.map((option, i) => {
        return i == index ? { ...option, text: newValue } : { ...option };
      })
    );
  };

  const handleAddOption = () => {
    setOptions((options) => [...options, { text: "" }]);
  };

  const handleRemoveOption = (index) => {
    setOptions((options) =>
      options.filter((val, i) => {
        return i != index;
      })
    );
  };

  const handleAllowMultiple = (event) => {
    setAllowMultiple(event.target.checked);
  };

  /*
  const handleAllowShareChange = (event) => {
    setAllowShare(event.target.checked);
  };
  */

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const alert = (text) => {
    setAlertText(text);
    setOpenAlert(true);
  };

  const handleSave = async () => {
    // check for empty question
    if (!question) {
      return alert("Please enter a poll question.");
    }
    // check for empty options
    for (let option of options) {
      if (!option.text) {
        return alert(
          "Please ensure all options contain text. Remove any empty options."
        );
      }
    }
    if (isAdd) {
      const addResponse = await api.post("/api/polling/poll", {
        question,
        options,
        allowMultiple,
        //allowShare,
        eventId: event.id,
      });
    } else {
      const editResponse = await api.put("/api/polling/poll", {
        pollId: pollData.id,
        question,
        options,
        allowMultiple,
        //allowShare,
      });
    }
    handleClose();
  };

  return (
    <div style={{ width: "650px" }}>
      <AlertModal
        open={openAlert}
        onClose={handleCloseAlert}
        content={alertText}
        closeText="Cancel"
      />
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField
          id="question"
          label="Poll Question"
          variant="outlined"
          value={question}
          onChange={handleChangeQuestion}
        />

        <div className={classes.optionsContainer}>
          {options.map((option, index) => {
            return (
              <div className={classes.optionContainer}>
                <TextField
                  variant="outlined"
                  value={options[index].text}
                  placeholder={`Option ${index + 1}`}
                  onChange={(event) => handleChangeOptions(event, index)}
                  fullWidth
                  style={{ margin: "5px 0px" }}
                />
                <div
                  onClick={() => handleRemoveOption(index)}
                  className={classes.removeOption}
                >
                  <RemoveCircleIcon />
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px 0px",
          }}
        >
          <div onClick={handleAddOption} className={classes.addOption}>
            <AddIcon />
            <span>Add Option</span>
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={allowMultiple}
                  onChange={handleAllowMultiple}
                  name="checked"
                />
              }
              label="Allow Multiple Answers"
            />
          </FormGroup>
        </div>
        {/*}
        <FormControlLabel
          control={
            <Checkbox
              checked={allowShare}
              onChange={handleAllowShareChange}
              color="primary"
            />
          }
          label="Share results automatically after voting "
        /> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          class="Button1"
          style={{ width: "150px", alignSelf: "flex-end" }}
        >
          Save
        </Button>
      </FormControl>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { model: state.model, event: state.event, settings: state.settings };
};

export default connect(mapStateToProps, actions)(PollBuilder);
