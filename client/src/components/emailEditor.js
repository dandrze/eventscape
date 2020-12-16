import React, { Component, useState } from "react";
import { connect } from "react-redux";
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

import * as actions from "../actions";
import { recipients as recipientsEnum } from "../model/enums";

const EmailEditor = (props) => {
  const classes = useStyles();

  const [from, setFrom] = useState("Enter From Name");
  const [subject, setSubject] = useState(
    "Thank You for Registering for {Event_Name}"
  );
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [offset, setOffset] = useState(-1);
  const [
    html,
    setHtml,
  ] = useState(`<p style="text-align: left">Hello {first_name},</p>
  <p style="text-align: left">Thank you for registering for {event_name}.</p>`);
  const [status, setStatus] = useState("draft");
  const [recipients, setRecipients] = useState(recipientsEnum.NEW_REGISTRANTS);
  const handleChangeRecipients = (event) => {
    setRecipients(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
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

  const handleChangeOffset = (event) => {
    setOffset(event.target.value);
  };

  const handleSave = async () => {
    const daysInMinutes = Number(days) * 24 * 60;
    const hoursInMinutes = Number(hours) * 60;
    const minutesFromEvent =
      offset * (Number(mins) + hoursInMinutes + daysInMinutes);

    await props.addEmail({
      recipients,
      status,
      from,
      subject,
      minutesFromEvent,
    });

    props.handleSubmit();
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
            <FormControl className={classes.margin}>
              <InputLabel id="demo-customized-select-label">Status</InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={status}
                onChange={handleChangeStatus}
                input={<BootstrapInput />}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"draft"}>Draft</MenuItem>
                <MenuItem value={"disabled"}>Disabled</MenuItem>
              </Select>
            </FormControl>
          </div>
          <button className="Button1" id="save" onClick={handleSave}>
            Save
          </button>
        </div>

        <div id="designBoard">
          <div style={{ overflow: "hidden" }}>
            <div id="emailInputs">
              <div className="inputDiv">
                <label htmlFor="toSelect" className="emailLabel">
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
                      <MenuItem value={recipientsEnum.EMAIL_LIST}>
                        Email List
                      </MenuItem>
                      <MenuItem value={recipientsEnum.NEW_REGISTRANTS}>
                        New Registrants
                      </MenuItem>
                      <MenuItem value={recipientsEnum.ALL_REGISTRANTS}>
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
                <label htmlFor="from" className="emailLabel">
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
                <label htmlFor="subject" className="emailLabel">
                  Subject:{" "}
                </label>
                <input
                  type="text"
                  className="emailInput"
                  name="subject"
                  placeholder=""
                  value={subject}
                  onChange={handleChangeSubject}
                ></input>
              </div>

              <div className="inputDiv">
                <label htmlFor="sendTime" className="emailLabel">
                  Scheduled Send Time:{" "}
                </label>
                <br></br>
                {recipients === recipientsEnum.NEW_REGISTRANTS ? (
                  <label className="emailLabel">Upon Registration</label>
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
                    <label className="emailLabel">days </label>

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
                    <label className="emailLabel">hours </label>
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
                    <label className="emailLabel">minutes </label>

                    <Select value={offset} onChange={handleChangeOffset}>
                      <MenuItem value={-1}>Before</MenuItem>
                      <MenuItem value={1}>After</MenuItem>
                    </Select>

                    <label className="emailLabel">{" event start time"}</label>
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

export default connect(null, actions)(EmailEditor);
