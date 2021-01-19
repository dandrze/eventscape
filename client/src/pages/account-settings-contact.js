import React from "react";
import NavBar3 from "../components/navBar3.js";
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

function AccountSettings(props) {
  const classes = useStyles();

  const [fName, setFName] = React.useState(props.user.firstName || "");
  const [lName, setLName] = React.useState(props.user.lastName || "");
  const [emailAddress, setEmailAddress] = React.useState(
    props.user.emailAddress || ""
  );

  const handleChangeEmailAddress = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleChangeFName = (event) => {
    setFName(event.target.value);
  };

  const handleChangeLName = (event) => {
    setLName(event.target.value);
  };

  const handleUpdate = () => {
    props.updateAccountContact(props.user.id, {
      firstName: fName,
      lastName: lName,
      emailAddress,
    });
  };

  return (
    <div>
      <NavBar3
        displaySideNav="false"
        displaySideNavAccount="true"
        highlight="contact"
        content={
          <div className="form-box shadow-border form-width">
            <h3>Contact Details</h3>
            <br></br>
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
                value={emailAddress}
                onChange={handleChangeEmailAddress}
              />
            </FormControl>
            <br></br>
            <br></br>
            <button className="Button1" type="submit" onClick={handleUpdate}>
              Update Contact
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

export default connect(mapStateToProps, actions)(AccountSettings);
