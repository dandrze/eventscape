import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import SimpleNavBar from "../components/simpleNavBar";
import { makeStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import momentTZ from "moment-timezone";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import * as actions from "../actions";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Question = ({ question, next, children, input }) => {
  return (
    <div>
      <h2
        className="theme-color"
        style={{ fontWeight: 400, marginBottom: "30px" }}
      >
        {question}
      </h2>
      {input}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <button
          className="Button1"
          style={{ width: "150px", marginTop: "30px" }}
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

function CreateEvent(props) {
  const classes = useStyles();

  const [step, setStep] = useState(0);
  const [eventCat, setEventCat] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLink, setEventLink] = React.useState("");

  const [linkUnavailable, setLinkUnavailable] = React.useState(false);

  const [linkHelperText, setLinkHelperText] = React.useState("");

  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());
  const [eventTimeZone, setEventTimeZone] = React.useState(momentTZ.tz.guess());

  const [registrationRequired, setRegistrationRequired] = React.useState(true);

  const [color, setColor] = useState("#B0281C");

  const handleChangeEventTitle = (event) => {
    event.preventDefault();
    setEventTitle(event.target.value);
  };

  const handleChangeEventCat = (event) => {
    setEventCat(event.target.value);
  };
  const handleChangeEventDescription = (event) => {
    setEventDescription(event.target.value);
  };

  const handleChangeregistrationRequired = (event) => {
    setRegistrationRequired(event.target.value);
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Question
            question="What is the name of your event?"
            next={handleNext}
            input={
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  id="title"
                  variant="outlined"
                  value={eventTitle}
                  onChange={handleChangeEventTitle}
                />
              </FormControl>
            }
          />
        );
      case 1:
        return (
          <Question
            question="What type of event is it?"
            next={handleNext}
            input={
              <FormControl variant="outlined" className={classes.formControl}>
                {/* Category */}
                <InputLabel id="event-cat" className="mui-select-css-fix">
                  Category
                </InputLabel>
                <Select
                  labelId="event-cat"
                  id="event-cat-select"
                  required="true"
                  value={eventCat}
                  onChange={handleChangeEventCat}
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  <MenuItem value={"business_professional"}>
                    Business & Professional
                  </MenuItem>
                  <MenuItem value={"charity_causes"}>Charity & Causes</MenuItem>
                  <MenuItem value={"education"}>Education</MenuItem>
                  <MenuItem value={"fashion"}>Fashion</MenuItem>
                  <MenuItem value={"government_politics"}>
                    Government & Politics
                  </MenuItem>
                  <MenuItem value={"music"}>Music</MenuItem>
                  <MenuItem value={"performing_visual_arts"}>
                    Performing & Visual Arts
                  </MenuItem>
                  <MenuItem value={"religion_spirituality"}>
                    Religion & Spirituality
                  </MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
            }
          />
        );
      case 2:
        return (
          <Question
            next={handleNext}
            question="Does your event require attendees to register or is it open to the public?"
            input={
              <FormControl component="fieldset">
                <RadioGroup
                  value={registrationRequired}
                  onChange={handleChangeregistrationRequired}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Registration required"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Open to public"
                  />
                </RadioGroup>
              </FormControl>
            }
          />
        );

      case 3:
        return (
          <Question
            question="Describe your event in 1-2 brief sentences."
            next={handleNext}
            input={
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  id="title"
                  variant="outlined"
                  value={eventDescription}
                  onChange={handleChangeEventDescription}
                  multiline
                  rows={2}
                />
              </FormControl>
            }
          />
        );
    }
  };

  return (
    <SimpleNavBar
      content={
        <div
          style={{
            alignSelf: "baseline",
            width: "800px",
            background: "white",
            padding: "60px",
            marginTop: "120px",
          }}
        >
          {getStepContent()}
        </div>
      }
    />
  );
}

export default connect(null, actions)(CreateEvent);
