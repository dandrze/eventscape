import React from "react";
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

function Login(props) {
  const classes = useStyles();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    const isAuth = await props.signInLocal(email, password);

    if (isAuth) {
      props.history.push("/design");
    }
  };

  return (
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
      <br></br>
      <button className="Button1" type="submit" onClick={handleSubmit}>
        Sign In
      </button>
    </div>
  );
}

export default connect(null, actions)(Login);
