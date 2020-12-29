import React from "react";
import NavBar3 from "../components/navBar3.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

function AccountSettingsPassword(props) {
  const classes = useStyles();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const handleChangeCurrentPassword = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleChangeConfirmNewPassword = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleSubmit = async () => {
    if (newPassword === confirmNewPassword) {
      const response = await props.updatePassword(
        props.user.id,
        currentPassword,
        newPassword
      );
      if (response) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } else {
      toast.error("New passwords do not match");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div>
      <NavBar3
        displaySideNav="false"
        displaySideNavAccount="true"
        highlight="password"
        content={
          <div className="form-box shadow-border form-width">
            <h3>Update Password</h3>
            <br></br>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="password"
                id="current-password"
                label="Current Password"
                variant="outlined"
                value={currentPassword}
                onChange={handleChangeCurrentPassword}
              />
            </FormControl>
            <br></br>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="password"
                id="new-password"
                label="New Password"
                variant="outlined"
                value={newPassword}
                onChange={handleChangeNewPassword}
              />
            </FormControl>
            <br></br>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                type="password"
                id="confirm-new-password"
                label="Confirm New Password"
                variant="outlined"
                value={confirmNewPassword}
                onChange={handleChangeConfirmNewPassword}
              />
            </FormControl>
            <br></br>
            <br></br>
            <button className="Button1" type="submit" onClick={handleSubmit}>
              Save
            </button>
          </div>
        }
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { event: state.event, user: state.user };
};

export default connect(mapStateToProps, actions)(AccountSettingsPassword);
