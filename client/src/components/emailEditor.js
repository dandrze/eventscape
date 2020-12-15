import React, { Component, useState } from "react";
import NavBar3 from "../components/navBar3.js";
import "./emailEditor.css";
import BootstrapInput from "../components/selectInput";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import EmailList from "../components/emailList";
import SendTestEmail from "../components/sendTestEmail";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import FroalaEmail from "../components/froalaEmail";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Cancel from "../icons/cancel.svg";
import { Hidden } from "@material-ui/core";

const EmailEditor = (props) => {
  const classes = useStyles();

  const [from, setFrom] = useState("Enter From Name");
  const [subject, setSubject] = useState("Enter Subject");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [
    html,
    setHtml,
  ] = useState(`<p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">Thank you for registering for {event_name}.</p>`);
  const [status, setStatus] = React.useState("draft");
  const [recipients, setRecipients] = useState("newRegistrants");
  const handleChangeRecipients = (event) => {
    setRecipients(event.target.value);
  };

  const handleChangeFrom = (event) => {
    setFrom(event.target.value);
  };
  const handleChangeSubject = (event) => {
    setSubject(event.target.value);
  };

  const handleChangeDays = (event) => {
    setDays(forceInRange(event.target.value, 0, 180));
  };

  const handleChangeHours = (event) => {
    setHours(forceInRange(event.target.value, 0, 23));
  };

  const handleChangeMins = (event) => {
    setMins(forceInRange(event.target.value, 0, 59));
  };

  const forceInRange = (num, lower, upper) => {
    if (num < lower) {
      return lower;
    } else if (num > upper) {
      return upper;
    } else {
      return num;
    }
  };

  const buildMenuItems = (start, end) => {
    return <MenuItem value={1}>1</MenuItem>;
  };

  return (
    <div className="email-editor-container">
      <div id="cancelBar">
        <Tooltip title="Close Editor">
          <img
            src={Cancel}
            id="cancelIcon"
            height="24px"
            onClick={props.handleClose}
          ></img>
        </Tooltip>
      </div>
      <div className="design">
        <div id="topButtons">
          <SendTestEmail />
          <div id="status">
            <StatusSelect />
          </div>
          <button className="Button1" id="save">
            Save
          </button>
        </div>

        <div id="designBoard">
          <div style={{ overflow: "hidden" }}>
            <div id="emailInputs">
              <div className="inputDiv">
                <label htmlFor="toSelect" id="emailLabel">
                  To:{" "}
                </label>
                <div id="toSelect">
                  <FormControl className={classes.margin}>
                    <Select
                      labelId="demo-customized-select-label"
                      id="demo-customized-select"
                      value={recipients}
                      onChange={handleChangeRecipients}
                      input={<BootstrapInput />}
                    >
                      <MenuItem value={"emailList"}>Email List</MenuItem>
                      <MenuItem value={"newRegistrants"}>
                        New Registrants
                      </MenuItem>
                      <MenuItem value={"allRegistrants"}>
                        All Registrants
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <div id="editEmailList">
                    {recipients === "emailList" ? <EmailList /> : null}
                  </div>
                </div>
              </div>

              <div className="inputDiv">
                <label htmlFor="from" id="emailLabel">
                  From:{" "}
                </label>
                <input
                  type="text"
                  className="emailInput"
                  name="from"
                  placeholder=""
                  value={from}
                  onChange={handleChangeFrom}
                ></input>
                <br></br>
              </div>

              <div className="inputDiv">
                <label htmlFor="subject" id="emailLabel">
                  Subject:{" "}
                </label>
                <input
                  type="text"
                  className="emailInput"
                  name="subject"
                  placeholder=""
                  value="Thank You for Registering for {Event_Name}"
                ></input>
              </div>

              <div className="inputDiv">
                <label htmlFor="sendTime" id="emailLabel">
                  Scheduled Send Time:{" "}
                </label>
                <br></br>
                {recipients === "newRegistrants" ? (
                  <label id="emailLabel">Upon Registration</label>
                ) : (
                  <>
                    <TextField
                      id="number-days"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 180 }}
                      onChange={handleChangeDays}
                      value={days}
                    />
                    <label id="emailLabel">days </label>

                    <TextField
                      id="number-hours"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 23 }}
                      onChange={handleChangeHours}
                      value={hours}
                    />
                    <label id="emailLabel">hours </label>
                    <TextField
                      id="number-mins"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 180 }}
                      onChange={handleChangeMins}
                      value={mins}
                    />
                    <label id="emailLabel">minutes </label>

                    <label id="emailLabel">before event start time</label>
                  </>
                )}
              </div>
            </div>

            <div style={{ margin: "3%" }}>
              <FroalaEmail />
            </div>
          </div>
        </div>
        <div style={{ color: "#F8F8F8" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      </div>
    </div>
  );
};

/*for select input*/
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: 0,
  },
}));

function StatusSelect() {
  const classes = useStyles();
  const [status, setStatus] = React.useState("draft");
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  return (
    <div>
      <FormControl className={classes.margin}>
        <InputLabel id="demo-customized-select-label">Status</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={status}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value={"active"}>Active</MenuItem>
          <MenuItem value={"draft"}>Draft</MenuItem>
          <MenuItem value={"disabled"}>Disabled</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function ToSelect() {
  const classes = useStyles();
  const [to, setTo] = React.useState("newRegistrants");
  const handleChange = (event) => {
    setTo(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.margin}>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={to}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value={"emailList"}>Email List</MenuItem>
          <MenuItem value={"newRegistrants"}>New Registrants</MenuItem>
          <MenuItem value={"allRegistrants"}>All Registrants</MenuItem>
        </Select>
      </FormControl>
      <div id="editEmailList">{to === "emailList" ? <EmailList /> : null}</div>
    </div>
  );
}

/*for date time picker*/

function DateTimePickers() {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
      <KeyboardTimePicker
        margin="normal"
        id="time-picker"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change time",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

export default EmailEditor;
