import React, { useState } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import SimpleNavBar from "../components/simpleNavBar";

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

const EnterCode = ({ signInWithCode, location }) => {
  const emailAddress = location.state.emailAddress;
  const [code, setCode] = useState(null);
  const classes = useStyles();

  console.log(emailAddress);

  const verifyCode = async () => {
    signInWithCode(emailAddress, code);
  };

  const handleKeypressSubmit = (event) => {
    if (event.key === "Enter") verifyCode();
  };

  const handleChangeCode = (event) => {
    if (event.target.value.length <= 6) setCode(event.target.value);
  };

  return (
    <SimpleNavBar
      content={
        <div className="form-box shadow-border" style={{ width: "600px" }}>
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
              value={code}
              onChange={handleChangeCode}
              onKeyPress={handleKeypressSubmit}
            />
          </FormControl>
          <button
            className="Button1"
            style={{ margin: "auto", width: "200px" }}
            onClick={verifyCode}
          >
            Login
          </button>
        </div>
      }
    />
  );
};

export default connect(null, actions)(EnterCode);
