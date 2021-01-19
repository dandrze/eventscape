import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import { toast } from "react-toastify";

import * as actions from "../actions";
import { checkEmailExists } from "../actions";

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
  const classes = useStyles();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailErrorText, setEmailErrorText] = useState(false);
  const [firstNameErrorText, setFirstNameErrorText] = useState("");
  const [lastNameErrorText, setLastNameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState("");

  const handleChangeEmail = (event) => {
    setEmailAddress(event.target.value);
    setEmailErrorText("");
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setPasswordErrorText("");
    setConfirmPasswordErrorText("");
  };

  const emailExists = async () => {
    const response = await props.checkEmailExists(emailAddress);
    console.log(response);
    return response;
  };

  const handleSubmit = async () => {
    if (!firstName) {
      setFirstNameErrorText("Please enter a first name");
    } else if (!lastName) {
      setLastNameErrorText("Please enter a last name");
    } else if (!emailAddress) {
      setEmailErrorText("Please enter your email address");
    } else if (await emailExists()) {
      setEmailErrorText(
        "Account already exists with this email address. Please login or contact support."
      );
    } else if (!password) {
      setPasswordErrorText("Please enter a password");
    } else if (!confirmPassword) {
      setConfirmPasswordErrorText("Please confirm your password");
    } else if (password != confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setConfirmPasswordErrorText("Passwords do not match");
      setPasswordErrorText("Passwords do not match");
    } else {
      const res = await props.createAccount({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      console.log(res);
      const auth = await props.signInLocal(emailAddress, password);
      props.history.push("/event-details");
    }
  };
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
    setFirstNameErrorText("");
  };

  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
    setLastNameErrorText("");
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordErrorText("");
    setConfirmPasswordErrorText("");
  };

  return (
    <div>
      <div
        className="form-box shadow-border"
        style={{
          maxWidth: "550px",
          marginTop: "60px",
        }}
      >
        <h1>
          Create your<br></br>free account to<br></br>continue.
        </h1>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            type="text"
            id="f-name"
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={handleChangeFirstName}
            helperText={firstNameErrorText}
          />
        </FormControl>
        <br></br>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            type="text"
            id="l-name"
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={handleChangeLastName}
            helperText={lastNameErrorText}
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
          />
        </FormControl>
        <br></br>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            type="password"
            id="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={handleChangePassword}
            helperText={passwordErrorText}
          />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            type="password"
            id="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            helperText={confirmPasswordErrorText}
          />
        </FormControl>
        <br></br>
        <br></br>
        <button className="Button1" type="submit" onClick={handleSubmit}>
          Create My Account
        </button>
      </div>
      <div className="force-width">
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      </div>
    </div>
  );
}

export default connect(null, actions)(Create_Account);
