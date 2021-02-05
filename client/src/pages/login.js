import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import EventscapeLogo from "../icons/eventscape-logo-navbar.png";
import SimpleNavBar from "../components/simpleNavBar";
import LongLoadingScreen from "../components/LongLoadingScreen";

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

function Login(props) {
  const classes = useStyles();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsloading] = useState(false);

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    setIsloading(true);
    const isAuth = await props.signInLocal(email, password);
    setIsloading(false);
    if (isAuth.success) {
      props.history.push("/app/design");
    }
  };

  if (isLoading) {
    return <LongLoadingScreen text="Signing In..." />;
  }

  return (
    <div>
      <SimpleNavBar
        content={
          <div className="form-box shadow-border">
            <h1>Sign in to continue.</h1>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleChangeEmail}
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
              />
            </FormControl>
            <br></br>
            <button className="Button1" type="submit" onClick={handleSubmit}>
              Sign In
            </button>
            <p className="subtext" style={{ marginTop: "8px" }}>
              Don't have an account yet?{" "}
              <Link to="/create-account" className="link1">
                Create an account
              </Link>
            </p>
            <p className="subtext">
              <Link to="reset-password" className="link1">
                Forgot your password?
              </Link>
            </p>
          </div>
        }
      />
    </div>
  );
}

export default connect(null, actions)(Login);
