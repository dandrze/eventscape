import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import SimpleNavBar from "../components/simpleNavBar";
import LongLoadingScreen from "../components/LongLoadingScreen";

import * as actions from "../actions";
import api from "../api/server";
import { isValidEmailFormat } from "../hooks/validation";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Login(props) {
  const classes = useStyles();
  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("eventid");

  const handleChangeEmail = (event) => {
    setEmailAddress(event.target.value.toLowerCase());
  };

  const emailExists = async () => {
    const response = await props.checkEmailExists(emailAddress);
    return response;
  };

  const handleSubmit = async () => {
    if (!isValidEmailFormat(emailAddress)) {
      setError("Please enter a valid email address");
    } else if (!(await emailExists())) {
      setError(
        <p style={{ fontSize: "0.75rem", color: "#f44336" }}>
          Account does not exist.{" "}
          <a
            href="/signup"
            style={{ fontWeight: 500, textDecoration: "underline" }}
          >
            Create an account
          </a>
        </p>
      );
    } else {
      api.post("/auth/send-code", { emailAddress });
      props.history.push({
        pathname: "/code",
        state: { emailAddress, eventId },
      });
    }
  };

  const handleKeypressSubmit = (event) => {
    if (event.key === "Enter") handleSubmit();
  };

  // if the user is already logged in, take them straight to the app homepage
  if (props.user?.id) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }

  return (
    <div>
      <SimpleNavBar
        content={
          <div className="form-box shadow-border registration-box">
            <h1>Sign in to continue.</h1>
            <p className="subtext" style={{ marginTop: "8px" }}>
              Enter the email you used to sign up below and we'll send you a
              login code.
            </p>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                value={emailAddress}
                onChange={handleChangeEmail}
                onKeyPress={handleKeypressSubmit}
                helperText={error}
                error={error}
              />
            </FormControl>
            <br></br>

            <button className="Button1" type="submit" onClick={handleSubmit}>
              Get Code
            </button>
            <p className="subtext" style={{ marginTop: "8px" }}>
              Don't have an account yet?{" "}
              <Link to="/signup" className="link1">
                Create an account
              </Link>
            </p>
          </div>
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(Login);
