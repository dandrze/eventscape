import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import { isMobile } from "react-device-detect";
import SimpleNavBar from "../components/simpleNavBar";
import * as actions from "../actions";
import FoldingCube from "../components/FoldingCube";

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

function Create_Account(props) {
  const { email } = useParams();
  const classes = useStyles();

  const [firstName, setFirstName] = useState("");
  const [emailAddress, setEmailAddress] = useState(email || "");

  const [emailErrorText, setEmailErrorText] = useState(false);
  const [firstNameErrorText, setFirstNameErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("eventid");

  const handleChangeEmail = (event) => {
    setEmailAddress(event.target.value.toLowerCase());
    setEmailErrorText("");
  };

  const emailExists = async () => {
    const response = await props.checkEmailExists(emailAddress);
    return response;
  };

  const handleSubmit = async () => {
    if (!firstName) {
      setFirstNameErrorText("Please enter a first name");
    } else if (!emailAddress) {
      setEmailErrorText("Please enter your email address");
    } else if (!isValidEmailFormat(emailAddress)) {
      setEmailErrorText("Please enter a valid email address");
    } else if (await emailExists()) {
      setEmailErrorText(
        "Account already exists with this email address. Please login or contact support."
      );
    } else {
      setIsLoading(true);
      const res = await props.createAccount(emailAddress, firstName, isMobile);

      props.history.push({
        pathname: "/code",
        state: { emailAddress, isNewUser: true, eventId },
      });
    }
  };
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
    setFirstNameErrorText("");
  };

  const handleKeypressSubmit = (event) => {
    if (event.key === "Enter") handleSubmit();
  };

  return (
    <div>
      <SimpleNavBar
        content={
          <div className="form-box shadow-border registration-box">
            <h1>Create your free account to continue.</h1>
            <p>Enter your name and email to receive a login code.</p>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="text"
                id="f-name"
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={handleChangeFirstName}
                helperText={firstNameErrorText}
                onKeyPress={handleKeypressSubmit}
              />
            </FormControl>

            <br></br>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                value={emailAddress}
                onChange={handleChangeEmail}
                helperText={emailErrorText}
                onKeyPress={handleKeypressSubmit}
                // if there is an email passed through url, don't allow edits
                disabled={email}
              />
            </FormControl>

            <br></br>
            {isLoading ? (
              <FoldingCube />
            ) : (
              <button
                className="Button1 gtag-signup"
                type="submit"
                onClick={handleSubmit}
              >
                Get login code
              </button>
            )}
            <p className="subtext" style={{ marginTop: "8px" }}>
              Already have an account?{" "}
              <Link
                to={`${eventId ? `/login?eventid=${eventId}` : "/login"}`}
                className="link1"
              >
                Sign in
              </Link>
            </p>
          </div>
        }
      />
    </div>
  );
}

export default connect(null, actions)(Create_Account);
