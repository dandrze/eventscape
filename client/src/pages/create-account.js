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

function Create_Account(props) {
  const classes = useStyles();

  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    props.signInLocal(email, password);
  };
  const handleChangeFName = (event) => {
    setFName(event.target.value);
  };

  const handleChangeLName = (event) => {
    setLName(event.target.value);
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
            value={fName}
            onChange={handleChangeFName}
          />
        </FormControl>
        <br></br>
        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            type="text"
            id="l-name"
            label="Last Name"
            variant="outlined"
            value={lName}
            onChange={handleChangeLName}
          />
        </FormControl>
        <br></br>
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
