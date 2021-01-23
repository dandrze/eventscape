import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
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

function ResetPassword(props) {
  const classes = useStyles();

  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);


  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    /*setIsloading(true);
    const isAuth = await props.signInLocal(email, password);
    setIsloading(false);
    if (isAuth.success) {
      props.history.push("/design");
    }*/
  };

  if (emailSent) {
    return (
        <div>
            <SimpleNavBar
                content={
                    <div className="form-box shadow-border">
                        <h2>Reset Password</h2>
                        <p>An email has been sent.</p>
                        <p>Please click the link when you get it.</p>
                    </div>
                }
            />
        </div>
    );
  }


  if (emailNotFound) {
    return (
        <div>
            <SimpleNavBar
                content={
                    <div className="form-box shadow-border">
                        <p>There doesn't appear to be an account created yet for this email address.</p>
                        <Link to="/create-account">
                            <button className="Button1">
                                Create an Account
                            </button>
                        </Link>
                    </div>
                }
            />
        </div>
    );
  }

  return (
    <div>
        <SimpleNavBar
            content={
                <div className="form-box shadow-border" style={{ width: "500px"}}>
                <h2>Reset Password</h2>
                <p className="subtext">Don't worry, happens to the best of us.</p>
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
                <div style={{ marginTop: "15px"}}>
                    <button className="Button1" type="submit" onClick={handleSubmit}>
                        Email me a recovery link
                    </button>
                </div>
                </div>
            }
        />
    </div>
  );
}

export default connect(null, actions)(ResetPassword);
