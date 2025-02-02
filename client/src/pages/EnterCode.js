import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import SimpleNavBar from "../components/simpleNavBar";

import * as actions from "../actions";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const EnterCode = ({ signInWithCode, location, history }) => {
  const [error, setError] = useState("");
  const emailAddress = location.state ? location.state.emailAddress : null;
  const [entryCode, setEntryCode] = useState("");
  const classes = useStyles();

  const eventId = location.state ? location.state.eventId : null;
  const isNewUser = location.state ? location.state.isNewUser : null;

  const verifyCode = async () => {
    const auth = await signInWithCode(emailAddress, entryCode);

    if (auth.success) {
      if (eventId) {
        // if their url contained a target event, go that event
        history.push(`/?eventid=${eventId}`);
      } else if (isNewUser) {
        // If it's a new user and they are not being invited to an event already (passed in by eventId), create a new event
        history.push("create-event");
      } else {
        // else push them to the dashboard
        history.push(`/`);
      }
    }
    if (auth.error) {
      setError(auth.error);
    }
  };

  const handleKeypressSubmit = (event) => {
    if (event.key === "Enter") verifyCode();
  };

  const handleChangeCode = (event) => {
    if (!isNaN(event.target.value) && event.target.value.length <= 6) {
      setEntryCode(event.target.value);
    }
  };

  return (
    <SimpleNavBar
      content={
        <div className="form-box shadow-border registration-box">
          {emailAddress ? (
            <>
              <h1>Email Sent!</h1>
              <p>
                We sent a code to {emailAddress}. <br />
                Check your inbox for your login code.
              </p>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  type="text"
                  id="code"
                  label="6 Digit Code"
                  variant="outlined"
                  value={entryCode}
                  onChange={handleChangeCode}
                  onKeyPress={handleKeypressSubmit}
                  helperText={error}
                  error={error}
                />
              </FormControl>
              <button
                className="Button1"
                style={{ margin: "auto", width: "200px" }}
                onClick={verifyCode}
              >
                Login
              </button>
              <p className="subtext" style={{ marginTop: "1.5rem" }}>
                Code not working? Request a new code{" "}
                <a href="/login" className="link1">
                  here
                </a>
                .<br />
                <br /> If you're having login issues, send us a message by
                clicking on the support icon in the bottom right and we'll help
                you right away!
              </p>
            </>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )}
        </div>
      }
    />
  );
};

export default connect(null, actions)(EnterCode);
