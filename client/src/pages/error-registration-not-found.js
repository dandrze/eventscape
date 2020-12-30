import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

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

function ErrorRegNotFound(props) {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [emailFound, setEmailFound] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);

  const [emailErrorText, setEmailErrorText] = useState(false);

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    setEmailErrorText("");
  };

  const handleSubmit = async () => {
    /*
    if (!email) {
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
        email,
        password,
        firstName,
        lastName,
      });

      console.log(res);
      const auth = await props.signInLocal(email, password);
      props.history.push("/event-details");
    }
    */
  };

  return (
    <div>
      <div
        className="form-box shadow-border"
        style={{
          maxWidth: "600px",
          height: "700px"
        }}
      >
        <h2>Oops, it seems that your registration for event name cannot be found.</h2>
        <p>Please enter your email address below to re-send your event link.</p>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            type="email"
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleChangeEmail}
            helperText={emailErrorText}
          />
        </FormControl>
        <br></br>
        <button className="Button1" type="submit" onClick={handleSubmit}>
          Resend My Event Link
        </button>

        {/* Email found and link sent confirmation message: */}
        {emailFound === true && (
          <>
            <br></br>
            <br></br>
            <p>Your link to join the event has been sent to the email address you entered. </p>
            <p>Please check your inbox and if it’s not there, try checking your junk mail.</p>
          </>
        )}

        {/* Email not found message: */}
        {emailNotFound === true && (
          <>
            <br></br>
            <br></br>
            <p>We could not find a registration for this email address. Please click below to register.</p>
            <Link to="https://link.eventscape.io">
              <button className="Button1" type="submit">
                Register for Event Name
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default connect(null, actions)(ErrorRegNotFound);
