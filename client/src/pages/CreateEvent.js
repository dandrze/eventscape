import React, { useState, useEffect } from "react";
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
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";

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

const Question = ({ question, next, children, input, skip }) => {
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
          textAlign: "right",
        }}
      >
        {skip ? (
          <button
            className="Button1"
            style={{
              width: "150px",
              marginTop: "30px",
              color: "#5d5d5d",
              border: "none",
              background: "none",
            }}
            onClick={skip}
          >
            Skip
          </button>
        ) : null}
        <button
          className="Button1"
          style={{ width: "150px", marginTop: "30px", marginLeft: "12px" }}
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
  const [eventCat, setEventCat] = useState("");
  const [eventCatError, setEventCatError] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [eventTitleError, setEventTitleError] = useState("");

  const [eventDescription, setEventDescription] = useState("");
  const [eventDescriptionError, setEventDescriptionError] = useState("");
  const [eventLink, setEventLink] = React.useState("");

  const [linkUnavailable, setLinkUnavailable] = React.useState(false);

  const [linkHelperText, setLinkHelperText] = React.useState("");

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDateError, setSelectedEndDateError] = useState("");

  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [eventTimeZone, setEventTimeZone] = React.useState(momentTZ.tz.guess());

  const [registrationRequired, setRegistrationRequired] = useState(true);
  const [requireYoutubeInstructions, setRequireYoutubeInstructions] = useState(
    "required"
  );

  const [color, setColor] = useState("#B0281C");

  useEffect(() => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setHours(19);
    startDate.setMinutes(0);
    setSelectedStartDate(startDate);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setHours(21);
    endDate.setMinutes(0);
    setSelectedEndDate(endDate);
  }, []);

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

  const handleChangeRequireYoutubeInstructions = (event) => {
    setRequireYoutubeInstructions(event.target.value);
  };

  const handleSubmitTitle = () => {
    if (eventTitle) {
      setEventTitleError("");
      handleNext();
    } else {
      setEventTitleError("Please enter a title for your event");
    }
  };

  const handleSubmitCat = () => {
    if (eventCat) {
      setEventCatError("");
      handleNext();
    } else {
      setEventCatError("Please select a category");
    }
  };

  const handleSubmitRegistrationRequired = () => {
    handleNext();
  };

  const handleSubmitDescription = () => {
    if (eventDescription) {
      setEventDescriptionError("");
      handleNext();
    } else {
      setEventDescriptionError("Please add a description");
    }
  };

  const handleSubmitDates = () => {
    if (!selectedEndDateError) {
      handleNext();
    }
  };

  const handleStartDateChange = (startDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDateError("");

    // if the new date is after the end date, push the end date 1 day after this new start date
    if (startDate > new Date(selectedEndDate)) {
      const pushedDate = new Date();
      pushedDate.setTime(startDate.getTime() + 1000 * 60 * 60 * 2);
      setSelectedEndDate(pushedDate);
    }
  };
  const handleEndDateChange = (endDate) => {
    if (endDate < new Date(selectedStartDate)) {
      setSelectedEndDateError("End date cannot be before the start date.");
    } else {
      setSelectedEndDateError("");

      setSelectedEndDate(endDate);
    }
  };
  const handleChangeTimeZone = (event) => {
    setEventTimeZone(event.target.value);

    console.log("event start time in UTC: ");
    console.log(
      momentTZ.tz(new Date(selectedStartDate), "UTC").format("YYYYMMDD HH:mm z")
    );
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  console.log(requireYoutubeInstructions);

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Question
            question="What is the name of your event?"
            next={handleSubmitTitle}
            input={
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  id="title"
                  variant="outlined"
                  value={eventTitle}
                  onChange={handleChangeEventTitle}
                  helperText={eventTitleError}
                  error={eventTitleError}
                />
              </FormControl>
            }
          />
        );
      case 1:
        return (
          <Question
            question="What type of event is it?"
            next={handleSubmitCat}
            skip={handleNext}
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
                  helperText={eventCatError}
                  error={eventCatError}
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
            next={handleSubmitRegistrationRequired}
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
            next={handleSubmitDescription}
            skip={handleNext}
            input={
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  id="title"
                  variant="outlined"
                  value={eventDescription}
                  onChange={handleChangeEventDescription}
                  multiline
                  rows={2}
                  helperText={eventDescriptionError}
                  error={eventDescriptionError}
                />
              </FormControl>
            }
          />
        );
      case 4:
        return (
          <Question
            question="When does your event start and end?"
            next={handleSubmitDates}
            input={
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {/* Start Date & Time */}
                <Grid container spacing={0}>
                  <Grid item xs={6} id="date-time-container">
                    <div id="date-left">
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <KeyboardDateTimePicker
                          variant="inline"
                          label="Start Date"
                          disableToolbar
                          inputVariant="outlined"
                          format="MM/dd/yyyy hh:mm a"
                          margin="none"
                          id="event-start-date"
                          value={selectedStartDate}
                          onChange={handleStartDateChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={6} id="date-time-container">
                    <div id="date-right">
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <KeyboardDateTimePicker
                          variant="inline"
                          label="End Date"
                          disableToolbar
                          inputVariant="outlined"
                          format="MM/dd/yyyy hh:mm a"
                          margin="none"
                          id="event-start-date"
                          value={selectedEndDate}
                          onChange={handleEndDateChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          error={selectedEndDateError}
                          helperText={selectedEndDateError}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            }
          />
        );
      case 5:
        return (
          <Question
            question="Eventscape uses Youtube Live for your streaming content. Do you know how to connect Youtube to your Eventscape event webpage?"
            next={handleNext}
            input={
              <FormControl component="fieldset">
                <RadioGroup
                  value={requireYoutubeInstructions}
                  onChange={handleChangeRequireYoutubeInstructions}
                >
                  <FormControlLabel
                    value="notRequired"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="required"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            }
          />
        );
      case 6:
        return requireYoutubeInstructions === "required" ? (
          <div>
            Eventscape uses Youtube Live to capture your stream. <br />
            <br />{" "}
            <a
              href="https://www.eventscape.io/youtube-live-setup/"
              style={{
                fontWeight: 500,
                textDecoration: "underline",
                color: "#b0281c",
              }}
            >
              This article{" "}
            </a>
            will provide a detailed step-by-step guide on how to setup YouTube
            Live to deliver the video stream to your Eventscape site.
            <br />
            <br />
            Save the link and return back to this page to complete your event.
            <div
              style={{
                textAlign: "right",
              }}
            >
              <button
                className="Button1"
                style={{
                  width: "150px",
                  marginTop: "30px",
                  marginLeft: "12px",
                }}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          handleNext()
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
