import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/server";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import SimpleNavBar from "../components/simpleNavBar";
import InfoMessage from "../components/InfoMessage";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

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
  const { token } = useParams();

  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = React.useState("");
  const [isLoading, setIsloading] = useState(true);
  const [tokenIsInvalid, setTokenIsInvalid] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [tokenIsExpired, setTokenIsExpired] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await api.get("/auth/validate-token/" + token);
        setTokenIsInvalid(false);
      } catch (err) {
        if (err.response.data.message === "expired") {
          setTokenIsExpired(true);
        } else {
          setTokenIsInvalid(true);
        }
      }
      setIsloading(false);
    };

    validateToken();
  }, []);

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
    setPasswordErrorText("");
  };

  const handleChangeNewPasswordConfirm = (event) => {
    setNewPasswordConfirm(event.target.value);
    setPasswordErrorText("");
  };

  const handleSubmit = async () => {
    if (newPassword != newPasswordConfirm) {
      setNewPassword("");
      setNewPasswordConfirm("");
      setPasswordErrorText("Passwords do not match");
    } else {
      setIsloading(true);
      try {
        const res = await api.post("/auth/change-password-with-token", {
          newPassword,
          token,
        });
        setPasswordUpdated(true);
        setIsloading(false);
      } catch (err) {
        toast.error(
          "Error when updating password: " + err.response.data.message
        );
        setIsloading(false);
      }
    }
  };

  return (
    <div>
      <SimpleNavBar
        content={
          <div className="form-box shadow-border">
            {isLoading ? (
              <CircularProgress />
            ) : passwordUpdated ? (
              <InfoMessage
                icon={<CheckCircleIcon style={{ fontSize: 50 }} />}
                header="Successfully changed password"
                body={
                  <p>
                    Your password was successfully changed. Please login using
                    your new password <a href="/login">here</a>.
                  </p>
                }
              />
            ) : tokenIsExpired ? (
              <InfoMessage
                icon={<WarningIcon style={{ fontSize: 50 }} />}
                header="Password link expired"
                body={
                  <p>
                    Your change password link has expired. Request a new one{" "}
                    <a href="/reset-password">here</a>.
                  </p>
                }
              />
            ) : tokenIsInvalid ? (
              <InfoMessage
                icon={<WarningIcon style={{ fontSize: 50 }} />}
                header="Invalid Link"
                body={
                  <>
                    <p>
                      Invalid password reset link. Request a new link{" "}
                      <a href="/reset-password">here</a>.
                    </p>
                    <p>
                      If this problem persists please contact support at{" "}
                      <a href="mailto:support@eventscape.io?subject=Password Reset">
                        support@eventscape.io
                      </a>
                      .
                    </p>
                  </>
                }
              />
            ) : (
              <>
                <h2>Change password</h2>
                <FormControl variant="outlined" className={classes.formControl}>
                  <TextField
                    type="password"
                    id="password"
                    label="New Password"
                    variant="outlined"
                    value={newPassword}
                    onChange={handleChangeNewPassword}
                    helperText={passwordErrorText}
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
                    helperText={passwordErrorText}
                  />
                </FormControl>
                <br></br>
                <br></br>
                <button
                  className="Button1"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Change Password
                </button>
              </>
            )}
          </div>
        }
      />
    </div>
  );
}

{
  /* When users click change password, they get logged in right away. */
}

export default connect(null, actions)(ChangePassword);
