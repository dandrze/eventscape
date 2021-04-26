import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import SimpleNavBar from "../components/simpleNavBar";
import LongLoadingScreen from "../components/LongLoadingScreen";

import * as actions from "../actions";
import api from "../api/server";

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
  const [emailAddress, setEmailAddress] = React.useState("");
  const [isLoading, setIsloading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const targetEventId = urlParams.get("eventid");
  const targetUrl = targetEventId ? `/?eventid=${targetEventId}` : "/";

  console.log(targetUrl);

  const handleChangeEmail = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleSubmit = async () => {
    api.post("/auth/send-code", { emailAddress });
    props.history.push({ pathname: "/code", state: { emailAddress } });
  };

  const handleKeypressSubmit = (event) => {
    if (event.key === "Enter") handleSubmit();
  };

  if (isLoading) {
    return <LongLoadingScreen text="Signing In..." />;
  }

  return (
    <div>
      <SimpleNavBar
        content={
          <div className="form-box shadow-border" style={{ width: "600px" }}>
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
              />
            </FormControl>
            <br></br>

            <button className="Button1" type="submit" onClick={handleSubmit}>
              Get Code
            </button>
            <p className="subtext" style={{ marginTop: "8px" }}>
              Don't have an account yet?{" "}
              <Link to="/create-account" className="link1">
                Create an account
              </Link>
            </p>
          </div>
        }
      />
    </div>
  );
}

export default connect(null, actions)(Login);
