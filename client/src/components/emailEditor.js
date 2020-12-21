import React, { useEffect, useState } from "react";
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
import {
  recipientsOptions,
  statusOptions,
  requiresScheduledSend,
} from "../model/enums";

const EmailEditor = (props) => {
  const classes = useStyles();

  const [timeError, setTimeError] = useState("");
  const [replyTo, setReplyTo] = useState(
    props.data.reply_to || "no-reply@eventscape.io"
  );
  const [subject, setSubject] = useState(props.data.subject || "");
  const [days, setDays] = useState(
    Math.abs(Math.floor(props.data.minutes_from_event / 1440))
  );
  const [hours, setHours] = useState(
    Math.abs(Math.floor((props.data.minutes_from_event % 1440) / 60))
  );
  const [mins, setMins] = useState(
    Math.abs(props.data.minutes_from_event % 60)
  );
  const [preposition, setPreposition] = useState(
    props.data.minutes_from_event <= 0 ? -1 : 1
  );
  const [html, setHtml] = useState(
    props.data.html || "Your email body goes here"
  );
  const [status, setStatus] = useState(
    props.data.status || statusOptions.DRAFT
  );
  const [recipients, setRecipients] = useState(
    props.data.recipients || recipientsOptions.NEW_REGISTRANTS
  );

  useEffect(() => {
    validateSendTime(days, hours, mins);
  });

  const handleChangeRecipients = (event) => {
    setRecipients(event.target.value);
    if (event.target.value == recipientsOptions.NEW_REGISTRANTS) {
      setDays(0);
      setHours(0);
      setMins(0);
    }
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleChangeReplyTo = (event) => {
    setReplyTo(event.target.value);
  };
  const handleChangeSubject = (event) => {
    setSubject(event.target.value);
  };

  const handleChangeDays = (event) => {
    const updatedDays = forceInRange(
      event.target.value,
      0,
      global.emailSendDateMaxDays
    );
    setDays(updatedDays);
  };

  const handleChangeHours = (event) => {
    const updatedHours = forceInRange(event.target.value, 0, 23);
    setHours(updatedHours);
  };

  const handleChangeMins = (event) => {
    const updatedMins = forceInRange(event.target.value, 0, 59);
    setMins(updatedMins);
  };

  const handleChangePreposition = (event) => {
    setPreposition(event.target.value);
  };

  const handleSave = async () => {
    const daysInMinutes = Number(days) * 24 * 60;
    const hoursInMinutes = Number(hours) * 60;
    const minutesFromEvent =
      preposition * (Number(mins) + hoursInMinutes + daysInMinutes);

    const sendDate = new Date(props.event.start_date);
    sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

    if (!timeError) {
      // if an id exists in the data, that means we're editing an email, so call editEmail. If it is invalid, then we're adding a new email
      if (props.data.id) {
        await props.editEmail(props.data.id, {
          recipients,
          status,
          replyTo,
          subject,
          minutesFromEvent,
          html,
        });
      } else {
        await props.addEmail({
          recipients,
          status,
          replyTo,
          subject,
          minutesFromEvent,
          html,
        });
      }

      props.handleSubmit();
    }
  };

  const handleHtmlChange = (updatedHtml) => {
    setHtml(updatedHtml);
  };

  const validateSendTime = (d, h, m) => {
    // uses direct inputs because it can't wait for the state to update to use the days, hours, mins states. Instead we call in d, h, m
    const daysInMinutes = Number(d) * 24 * 60;
    const hoursInMinutes = Number(h) * 60;
    const minutesFromEvent =
      preposition * (Number(m) + hoursInMinutes + daysInMinutes);

    const sendDate = new Date(props.event.start_date);
    sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

    // If the send time is in the past, and this is a scheduled send (not for new registrants), display an error message
    if (
      sendDate < new Date() &&
      recipients != recipientsOptions.NEW_REGISTRANTS
    ) {
      setTimeError(
        "This send time is in the past: " +
          sendDate.toLocaleString("en-us", {
            timeZoneName: "short",
            timeZone: props.event.time_zone,
          }) +
          ". Please set a send time in the future."
      );
    } else {
      setTimeError("");
    }
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
                <MenuItem value={statusOptions.ACTIVE}>Active</MenuItem>
                <MenuItem value={statusOptions.DRAFT}>Draft</MenuItem>
                <MenuItem value={statusOptions.DISABLED}>Disabled</MenuItem>
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
                      <MenuItem value={recipientsOptions.EMAIL_LIST}>
                        Email List
                      </MenuItem>
                      <MenuItem value={recipientsOptions.NEW_REGISTRANTS}>
                        New Registrants
                      </MenuItem>
                      <MenuItem value={recipientsOptions.ALL_REGISTRANTS}>
                        All Registrants
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <div id="editEmailList">
                    {recipients === recipientsOptions.EMAIL_LIST ? (
                      <EmailList />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="inputDiv">
                <label htmlFor="replyTo" className="emailLabel">
                  Reply To:{" "}
                </label>
                <input
                  type="text"
                  className="emailInput"
                  name="replyTo"
                  placeholder=""
                  value={replyTo}
                  onChange={handleChangeReplyTo}
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

              <div className="inputDiv" style={{ flexWrap: "wrap" }}>
                <label htmlFor="sendTime" className="emailLabel">
                  Scheduled Send Time:{" "}
                </label>
                <br></br>
                {recipients === recipientsOptions.NEW_REGISTRANTS ? (
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

                    <Select
                      value={preposition}
                      onChange={handleChangePreposition}
                    >
                      <MenuItem value={-1}>Before</MenuItem>
                      <MenuItem value={1}>After</MenuItem>
                    </Select>

                    <label className="emailLabel">{" event start time"}</label>
                  </>
                )}
                <div className="errorMessage">{timeError}</div>
              </div>
            </div>

            <div style={{ margin: "3%" }}>
              <FroalaEmail html={html} handleHtmlChange={handleHtmlChange} />
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

const mapStateToProps = (state) => {
  return {
    event: state.event,
  };
};

export default connect(mapStateToProps, actions)(EmailEditor);
