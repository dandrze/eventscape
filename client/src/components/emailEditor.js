import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "./emailEditor.css";
import BootstrapInput from "../components/selectInput";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import TextField from "@material-ui/core/TextField";
import SendTestEmail from "../components/sendTestEmail";
import "date-fns";
import FroalaEmail from "../components/froalaEmail";
import Tooltip from "@material-ui/core/Tooltip";

import * as actions from "../actions";
import { recipientsOptions, statusOptions } from "../model/enums";

const EmailEditor = (props) => {
  const classes = useStyles();

  const [timeError, setTimeError] = useState("");

  const [subject, setSubject] = useState(props.data.subject || "");
  const [days, setDays] = useState(
    Math.floor(Math.abs(props.data.minutesFromEvent / 1440))
  );
  const [hours, setHours] = useState(
    Math.floor(Math.abs((props.data.minutesFromEvent % 1440) / 60))
  );
  const [mins, setMins] = useState(Math.abs(props.data.minutesFromEvent % 60));
  const [preposition, setPreposition] = useState(
    props.data.minutesFromEvent <= 0 ? -1 : 1
  );
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState(
    props.data.status || statusOptions.DRAFT
  );
  /*
  // commented out, used for recipient drop down
  const [recipients, setRecipients] = useState(
    props.data.recipients || recipientsOptions.NEW_REGISTRANTS
  );
  */

  useEffect(() => {
    const htmlWithColor =
      props.data.html.replace(/{primary_color}/g, props.event.primaryColor) ||
      "";
    // keeping the href in the email is causing a lot of bugs before the event link is added.
    // the code below replaces the href with a placeholder that doesn't do anything
    const htmlWithLinksDisabled = disableLinks(htmlWithColor);
    setHtml(htmlWithLinksDisabled);
  }, []);

  useEffect(() => {
    validateSendTime(days, hours, mins);

    if (props.data.recipients == recipientsOptions.NEW_REGISTRANTS) {
      setDays(0);
      setHours(0);
      setMins(0);
    }
  }, [days, hours, mins]);

  /*
  const handleChangeRecipients = (event) => {
    setRecipients(event.target.value);
    if (event.target.value == recipientsOptions.NEW_REGISTRANTS) {
      setDays(0);
      setHours(0);
      setMins(0);
    }
  };*/

  const disableLinks = (inputHtml) => {
    return inputHtml.replace("href", "data-href");
  };

  const enableLinks = (inputHtml) => {
    return inputHtml.replace("data-href", "href");
  };
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
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

  const isEmailValid = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  };

  const handleSave = async () => {
    const daysInMinutes = Number(days) * 24 * 60;
    const hoursInMinutes = Number(hours) * 60;
    const minutesFromEvent =
      preposition * (Number(mins) + hoursInMinutes + daysInMinutes);

    const sendDate = new Date(props.event.startDate);
    sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

    if (!timeError) {
      // if an id exists in the data, that means we're editing an email, so call editEmail. If it is invalid, then we're adding a new email
      if (props.data.id) {
        await props.editEmail(props.data.id, {
          recipients: props.data.recipients,
          status,
          subject,
          minutesFromEvent,
          html: enableLinks(html),
        });
      } else {
        await props.addEmail({
          recipients: props.data.recipients,
          status,
          subject,
          minutesFromEvent,
          html: enableLinks(html),
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

    const sendDate = new Date(props.event.startDate);
    sendDate.setMinutes(sendDate.getMinutes() + minutesFromEvent);

    // If the send time is in the past, and this is a scheduled send (not for new registrants), display an error message
    if (
      sendDate < new Date() &&
      props.data.recipients != recipientsOptions.NEW_REGISTRANTS
    ) {
      setTimeError(
        "This send time is in the past: " +
          sendDate.toLocaleString("en-us", {
            timeZoneName: "short",
            timeZone: props.event.timeZone,
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

  const copyText = (event) => {
    event.target.select();
    document.execCommand("copy");
    toast.success("Copied to clipboard!", {
      autoClose: 1500,
      pauseOnHover: false,
    });
  };

  return (
    <div>
      <div className="top-button-bar">
        <div className="button-bar-left">
          <SendTestEmail
            subject={subject}
            html={enableLinks(html)}
            eventId={props.event.id}
            recipient={{
              firstName: props.user.firstName,
              lastName: "",
              emailAddress: props.user.emailAddress,
            }}
          />
        </div>
        <div className="button-bar-right" style={{ marginLeft: "auto" }}>
          {props.data.recipients != recipientsOptions.NEW_REGISTRANTS ? (
            <FormControl className={classes.margin}>
              <InputLabel id="demo-customized-select-label">Status</InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={status}
                onChange={handleChangeStatus}
                input={<BootstrapInput />}
                disabled={status === statusOptions.COMPLETE ? true : false}
              >
                <MenuItem value={statusOptions.ACTIVE}>Active</MenuItem>
                <MenuItem value={statusOptions.DRAFT}>Draft</MenuItem>
                {status === statusOptions.COMPLETE ? (
                  <MenuItem value={statusOptions.COMPLETE}>Complete</MenuItem>
                ) : null}
              </Select>
            </FormControl>
          ) : null}
        </div>
        <button
          className="Button1 button-bar-right"
          onClick={handleSave}
          style={{ marginLeft: "24px" }}
        >
          Save
        </button>
      </div>

      <div style={{ overflow: "hidden" }}>
        <div id="emailInputs">
          <div className="inputDiv">
            <label htmlFor="toSelect" className="emailLabel">
              To:{" "}
            </label>
            <div id="toSelect">
              <div className="disabled-text">{props.data.recipients}</div>
              {/*
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
              */}
              {/*
              <div id="editEmailList">
                {recipients === recipientsOptions.EMAIL_LIST ? (
                  <EmailList emailId={props.data.id} />
                ) : null}
              </div>
                */}
            </div>
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

          <div className="inputDiv input-container-flex-wrap">
            <label
              htmlFor="sendTime"
              className="emailLabel"
              style={{ marginTop: "4px" }}
            >
              Scheduled Send Time:{" "}
            </label>
            <br></br>
            {props.data.recipients === recipientsOptions.NEW_REGISTRANTS ? (
              <div className="disabled-text" style={{ marginTop: "4px" }}>
                Upon Registration
              </div>
            ) : (
              <>
                <div className="send-time-input">
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
                </div>
                <label className="emailLabel">days </label>

                <div className="send-time-input">
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
                </div>
                <label className="emailLabel">hours </label>

                <div className="send-time-input">
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
                </div>
                <label className="emailLabel">minutes </label>

                <Select value={preposition} onChange={handleChangePreposition}>
                  <MenuItem value={-1}>Before</MenuItem>
                  <MenuItem value={1}>After</MenuItem>
                </Select>

                <label className="emailLabel">{" event start time"}</label>
              </>
            )}
            <div className="errorMessage">{timeError}</div>
          </div>
          <div className="inputDiv input-container-flex-wrap">
            <label htmlFor="variables" className="emailLabel">
              Variables Toolbox:
            </label>
            <Tooltip title="Click to copy to clipboard">
              <input
                readOnly
                className="variable-bubble"
                onClick={copyText}
                value={"{event_name}"}
              />
            </Tooltip>
            <Tooltip title="Click to copy to clipboard">
              <input
                readOnly
                className="variable-bubble"
                onClick={copyText}
                value={"{first_name}"}
              />
            </Tooltip>
            <Tooltip title="Click to copy to clipboard">
              <input
                readOnly
                className="variable-bubble"
                onClick={copyText}
                value={"{last_name}"}
              />
            </Tooltip>
            <Tooltip title="Click to copy to clipboard">
              <input
                readOnly
                className="variable-bubble"
                onClick={copyText}
                value={"{start_date}"}
              />
            </Tooltip>
            <Tooltip title="Click to copy to clipboard">
              <input
                readOnly
                className="variable-bubble"
                onClick={copyText}
                value={"{end_date}"}
              />
            </Tooltip>
            <Tooltip title="Click to copy to clipboard">
              <input
                readOnly
                className="variable-bubble"
                onClick={copyText}
                value={"{event_link}"}
              />
            </Tooltip>
          </div>
          <div style={{ margin: "3% 0" }}>
            <FroalaEmail html={html} handleHtmlChange={handleHtmlChange} />
          </div>
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
    user: state.user,
  };
};

export default connect(mapStateToProps, actions)(EmailEditor);
