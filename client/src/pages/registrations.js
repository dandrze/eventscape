import React, { useEffect } from "react";
import { connect } from "react-redux";
import Modal1 from "../components/Modal1";

import "./registrations.css";

import NavBar3 from "../components/navBar3.js";
import RegistrationTable2 from "../components/RegistrationTable2.js";
import * as actions from "../actions";
import FormBuilder from "../components/FormBuilder";
import RegistrationForm from "../components/pageReactSections/RegistrationForm";
import { toast } from "react-toastify";
import ImportFile from "../components/ImportFile";

const Registrations = (props) => {
  {
    /*const [regOn, setRegOn] = React.useState(false);*/
  }
  const [openForm, setOpenForm] = React.useState(false);
  const [openReg, setOpenReg] = React.useState(false);
  const [openImport, setOpenImport] = React.useState(false);
  const [regButtonText, setRegButtonText] = React.useState("Edit Registration");
  const [edittingValues, setEdittingValues] = React.useState([]);
  const [standardFields, setStandardFields] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [edittingRowId, setEdittingRowId] = React.useState(null);
  const [
    triggerFetchRegistrations,
    setTriggerFetchRegistrations,
  ] = React.useState(false);

  // UseEffect mimicks OnComponentDidMount
  // get the list of registrations
  useEffect(() => {
    fetchRegistrations();
  }, [triggerFetchRegistrations, props.event]);

  //Separated function because useEffect should not be an async function
  const fetchRegistrations = async () => {
    if (props.event.id) {
      console.log("fetch reg called");
      props.fetchRegistrations(props.event.id);
      props.fetchRegistrationForm(props.event.id);
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

  const handleCloseImport = () => {
    setOpenImport(false);
  };

  const handleOpenReg = () => {
    setOpenForm(true);
  };

  const handleAddReg = () => {
    setRegButtonText("Add Registration");
    setOpenReg(true);
  };

  const handleImport = () => {
    setOpenImport(true);
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

  const triggerUpdate = () => {
    setTriggerFetchRegistrations(!triggerFetchRegistrations);
  };

  return (
    <div>
      <Modal1
        open={openImport}
        onClose={handleCloseImport}
        content={
          <ImportFile
            handleClose={handleCloseImport}
            triggerUpdate={triggerUpdate}
          />
        }
      />
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
              <button
                className="Button1 button-bar-right"
                style={{ marginLeft: "auto" }}
                onClick={handleOpenForm}
              >
                Edit Registration Form
              </button>

              <button
                className="Button1"
                style={{ marginLeft: "20px" }}
                onClick={handleImport}
              >
                Import Registrations from CSV
              </button>

              <button
                className="Button1"
                onClick={handleAddReg}
                style={{ marginLeft: "20px" }}
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
