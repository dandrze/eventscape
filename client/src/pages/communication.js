import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import NavBar3 from "../components/navBar3.js";
import ScheduledEmails from "../components/ScheduledEmails.js";
import EmailEditor from "../components/emailEditor";
import * as actions from "../actions";
import { blankEmail } from "../templates/emailTemplates";
import { statusOptions } from "../model/enums";
import Modal1 from "../components/Modal1";
import AccessDeniedScreen from "../components/AccessDeniedScreen.js";

const Communication = (props) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, [props.event]);

  const fetchData = async () => {
    if (props.event.id) {
      props.setLoaded(false);
      await props.fetchCommunicationList(props.event.id);
      props.setLoaded(true);
    }
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
  };

  const handleSubmitEditor = async () => {
    setOpenEditor(false);
    //props.setLoaded(false);
    const res = await props.fetchCommunicationList(props.event.id);
    //props.setLoaded(true);
  };

  const handleEditEmail = (data) => {
    setData(data);
    setOpenEditor(true);
  };

  const handleAddEmail = () => {
    setData(blankEmail);
    setOpenEditor(true);
  };

  const handleDeleteEmail = async (id) => {
    //props.setLoaded(false);
    await props.deleteEmail(id);
    await props.fetchCommunicationList(props.event.id);
    //props.setLoaded(true);
  };

  const handleDuplicateEmail = async (data) => {
    await props.addEmail({ ...data, status: statusOptions.DRAFT });
    await props.fetchCommunicationList(props.event.id);
  };

  return (
    <div>
      <Modal1
        open={openEditor}
        onClose={handleCloseEditor}
        content={
          <EmailEditor
            handleClose={handleCloseEditor}
            handleSubmit={handleSubmitEditor}
            data={data}
          />
        }
      />
      <NavBar3
        displaySideNav="true"
        highlight="communication"
        content={
          props.event.permissions?.communication ? (
            <div>
              <ScheduledEmails
                handleAdd={handleAddEmail}
                handleDelete={handleDeleteEmail}
                handleEdit={handleEditEmail}
                handleDuplicate={handleDuplicateEmail}
              />
            </div>
          ) : (
            <AccessDeniedScreen
              message="Please contact the event owner to add you as a collaborator for this
        event."
            />
          )
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { email: state.email, event: state.event };
};

export default connect(mapStateToProps, actions)(Communication);
