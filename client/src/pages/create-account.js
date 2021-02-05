import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import SimpleNavBar from "../components/simpleNavBar";

import { toast } from "react-toastify";

import * as actions from "../actions";
import { checkEmailExists } from "../actions";
import CreatePassword from "../components/CreatePassword";
import { CircularProgress } from "@material-ui/core";

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

  const [emailErrorText, setEmailErrorText] = useState(false);
  const [firstNameErrorText, setFirstNameErrorText] = useState("");
  const [lastNameErrorText, setLastNameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeEmail = (event) => {
    setEmailAddress(event.target.value);
    setEmailErrorText("");
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setPasswordErrorText("");
  };

  const emailExists = async () => {
    const response = await props.checkEmailExists(emailAddress);
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
    } else if (password.length < 8) {
      setPasswordErrorText("Password must be at least 8 characters");
    } else {
      setIsLoading(true);
      const res = await props.createAccount({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      const auth = await props.signInLocal(emailAddress, password);
      setIsLoading(false);
      props.history.push("/app/event-details");
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

  return (
    <div>
      <SimpleNavBar
        content={
          <div
            className="form-box shadow-border"
            style={{
              maxWidth: "550px",
              marginTop: "60px",
              marginBottom: "60px",
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

            <CreatePassword
              password={password}
              onChange={handleChangePassword}
              helperText={passwordErrorText}
            />

            <br></br>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <button className="Button1" type="submit" onClick={handleSubmit}>
                Create My Account
              </button>
            )}
            <p className="subtext" style={{ marginTop: "8px" }}>
              Already have an account?{" "}
              <Link to="/login" className="link1">
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
