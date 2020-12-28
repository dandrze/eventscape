import React, { useEffect } from "react";
import { connect } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

import "./registrations.css";

import NavBar3 from "../components/navBar3.js";
import RegistrationTable2 from "../components/RegistrationTable2.js";
import * as actions from "../actions";
import FormBuilder from "../components/FormBuilder";
import Switch1 from "../components/switch";
import RegistrationForm from "../components/pageReactSections/RegistrationForm";
import Cancel from "../icons/cancel.svg";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "600px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  registrationBackground: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: "50px",
    width: "600px",
    overflow: "scroll",
    height: "calc(100vh - 50px)",
  },
  formBuilderBackground: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: "20px",
    height: "calc(100vh - 50px)",
  },
  formControl: {
    margin: "20px 0px",
    minWidth: "100%",
  },
}));

const Registrations = (props) => {
  const [regOn, setRegOn] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openReg, setOpenReg] = React.useState(false);
  const [regButtonText, setRegButtonText] = React.useState("Edit Registration");
  const [edittingValues, setEdittingValues] = React.useState([]);
  const [standardFields, setStandardFields] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [edittingRowId, setEdittingRowId] = React.useState(null);
  const classes = useStyles();

  // UseEffect mimicks OnComponentDidMount
  // get the list of registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);

  //Separated function because useEffect should not be an async function
  const fetchRegistrations = async () => {
    const event = await props.fetchEvent();
    if (event) {
      props.fetchRegistrations(event.data.id);
      props.fetchRegistrationForm(event.data.id);
      setRegOn(event.data.registration);
    }
  };

  const handleChange = (event) => {
    if (props.setEventRegistration(event.target.checked, props.event.id)) {
      setRegOn(event.target.checked);
    }
  };

  const handleCloseForm = () => {
    fetchRegistrations();
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseReg = () => {
    fetchRegistrations();
    setOpenReg(false);
  };

  const handleOpenReg = () => {
    setOpenForm(true);
  };

  const handleAddReg = () => {
    setRegButtonText("Add Registration");
    setOpenReg(true);
  };

  const handleEditReg = (id, incomingstandardFields, incomingValues) => {
    setRegButtonText("Edit Registration");
    setEdittingValues(incomingValues);
    setStandardFields(incomingstandardFields);
    setEdittingRowId(id);
    setOpenReg(true);
  };

  const handleSubmitReg = async (values, emailAddress, firstName, lastName) => {
    // if we're editting a row (there is a row id set in state), then update the row
    if (edittingRowId) {
      props.updateRegistration(
        edittingRowId,
        values,
        emailAddress,
        firstName,
        lastName
      );
    } else {
      const res = await props.addRegistration(
        props.event.id,
        values,
        emailAddress,
        firstName,
        lastName
      );
      if (res) {
        toast.success("Registration successfuly added");
      }
    }
    fetchRegistrations();
    setEdittingRowId(null);
    setEdittingValues([]);
    setOpenReg(false);
  };

  const handleDeleteReg = async (id) => {
    props.deleteRegistration(id);
    fetchRegistrations();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openForm}
        onClose={handleCloseForm}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
        className={classes.modal}
      >
        <div className={classes.formBuilderBackground}>
          <FormBuilder handleClose={handleCloseForm} />
        </div>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openReg}
        onClose={handleCloseReg}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
        className={classes.modal}
      >
        <div className={classes.registrationBackground}>
          <div className="registration-modal-navbar">
            <Tooltip title="Close Form">
              <img
                src={Cancel}
                id="close-form-builder"
                height="24px"
                onClick={handleCloseReg}
              ></img>
            </Tooltip>
          </div>
          <RegistrationForm
            registerText={regButtonText}
            onSubmitCallback={handleSubmitReg}
            prePopulatedValues={edittingValues}
            standardFields={standardFields}
            isEditForm={true}
          />
        </div>
      </Modal>
      <NavBar3
        displaySideNav="true"
        highlight="registrations"
        content={
          <div className="container-width">
            <div className="top-button-bar">
              <div className="button-bar-left">
                <Tooltip title="If registration is off, attendees will go directly to the event page and no registration data will be collected.">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch1
                          checked={regOn}
                          onChange={handleChange}
                          name="checked"
                        />
                      }
                      label="Registration On"
                    />
                  </FormGroup>
                </Tooltip>
              </div>
              <button
                className="Button1 button-bar-right"
                onClick={handleOpenForm}
              >
                Edit Registration Form
              </button>
              <button
                className="Button1 button-bar-right"
                onClick={handleAddReg}
              >
                Add Registration
              </button>
            </div>
            <RegistrationTable2
              handleAddReg={handleAddReg}
              handleEditReg={handleEditReg}
              handleDeleteReg={handleDeleteReg}
            />
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    eventList: state.eventList,
    settings: state.settings,
    event: state.event,
    registration: state.registration,
  };
};

export default connect(mapStateToProps, actions)(Registrations);
