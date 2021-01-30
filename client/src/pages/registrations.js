import React, { useEffect } from "react";
import { connect } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Modal1 from "../components/Modal1";

import "./registrations.css";

import NavBar3 from "../components/navBar3.js";
import RegistrationTable2 from "../components/RegistrationTable2.js";
import * as actions from "../actions";
import FormBuilder from "../components/FormBuilder";
import Switch1 from "../components/switch";
import RegistrationForm from "../components/pageReactSections/RegistrationForm";
import { toast } from "react-toastify";

const Registrations = (props) => {
  {
    /*const [regOn, setRegOn] = React.useState(false);*/
  }
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
      console.log(event.data);
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
    setEdittingValues(null);
    setOpenReg(false);
  };

  const handleDeleteReg = async (id) => {
    props.deleteRegistration(id);
    fetchRegistrations();
  };

  return (
    <div>
      <Modal1
        open={openForm}
        onClose={handleCloseForm}
        content={<FormBuilder handleClose={handleCloseForm} />}
      />
      <Modal1
        open={openReg}
        onClose={handleCloseReg}
        content={
          <RegistrationForm
            registerText={regButtonText}
            onSubmitCallback={handleSubmitReg}
            prePopulatedValues={edittingValues}
            standardFields={standardFields}
            isEditForm={true}
          />
        }
      />
      <NavBar3
        displaySideNav="true"
        highlight="registrations"
        content={
          <div className="container-width">
            <div className="top-button-bar">
              {/*
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
              */}
              <button
                className="Button1 button-bar-right"
                style={{ marginLeft: "auto" }}
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
