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

function ChangePassword(props) {
  const classes = useStyles();

  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = React.useState("");
  const [isLoading, setIsloading] = useState(false);

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleChangeNewPasswordConfirm = (event) => {
    setNewPasswordConfirm(event.target.value);
  };

  const handleSubmit = async () => {
    /*
    setIsloading(true);
    const isAuth = await props.signInLocal(email, password);
    setIsloading(false);
    if (isAuth.success) {
      props.history.push("/design");
    }
    */
  };

  return (
    <div>
      <SimpleNavBar
        content={
          <div className="form-box shadow-border">
            <h2>Change password</h2>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="password"
                id="password"
                label="New Password"
                variant="outlined"
                value={newPassword}
                onChange={handleChangeNewPassword}
              />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="password"
                id="password-confirm"
                label="Confirm New Password"
                variant="outlined"
                value={newPasswordConfirm}
                onChange={handleChangeNewPasswordConfirm}
              />
            </FormControl>
            <br></br>
            <br></br>
            <button className="Button1" type="submit" onClick={handleSubmit}>
              Change Password
            </button>
          </div>
        }
      />
    </div>
  );
}

{/* When users click change password, they get logged in right away. */}

export default connect(null, actions)(ChangePassword);
