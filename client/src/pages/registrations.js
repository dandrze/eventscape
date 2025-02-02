import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Modal1 from "../components/Modal1";
import "./registrations.css";
import NavBar3 from "../components/navBar3.js";
import RegistrationTable2 from "../components/RegistrationTable2.js";
import * as actions from "../actions";
import FormBuilder from "../components/FormBuilder";
import NewRegistration from "../components/NewRegistration";
import { toast } from "react-toastify";
import ImportFile from "../components/ImportFile";
import AccessDeniedScreen from "../components/AccessDeniedScreen";

const Registrations = (props) => {
  const [openForm, setOpenForm] = useState(false);
  const [openReg, setOpenReg] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [isEditRegistration, setIsEditRegistration] = useState();
  const [edittingValues, setEdittingValues] = useState([]);
  const [standardFields, setStandardFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [edittingRowId, setEdittingRowId] = useState(null);
  const [triggerFetchRegistrations, setTriggerFetchRegistrations] =
    useState(false);

  // UseEffect mimicks OnComponentDidMount
  // get the list of registrations
  useEffect(() => {
    fetchRegistrations();
  }, [triggerFetchRegistrations, props.event]);

  //Separated function because useEffect should not be an async function
  const fetchRegistrations = async () => {
    if (props.event.id) {
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

  const handleAddReg = () => {
    setIsEditRegistration(false);
    setEdittingValues(null);
    setStandardFields(null);
    setOpenReg(true);
  };

  const handleImport = () => {
    setOpenImport(true);
  };

  const handleEditReg = (id, incomingstandardFields, incomingValues) => {
    setIsEditRegistration(true);

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
    await props.deleteRegistration(id);
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
        title="Import registrations from a CSV"
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
        title="Edit Registration Form"
        content={<FormBuilder handleClose={handleCloseForm} />}
      />
      <Modal1
        open={openReg}
        onClose={handleCloseReg}
        title={
          isEditRegistration ? "Edit Registration" : "Add New Registration"
        }
        content={
          <NewRegistration
            onSubmitCallback={handleSubmitReg}
            prePopulatedValues={edittingValues}
            standardFields={standardFields}
            isManualEntry={true}
            isEditRegistration={isEditRegistration}
          />
        }
      />

      <NavBar3
        displaySideNav="true"
        highlight="registrations"
        content={
          // only display content once the event is loaded
          props.event.id ? (
            props.event.permissions?.registration ? (
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
            ) : (
              <AccessDeniedScreen message="Please contact the event owner to provide you with permissions to this page." />
            )
          ) : null
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

export default connect(mapStateToProps, actions)(withRouter(Registrations));
