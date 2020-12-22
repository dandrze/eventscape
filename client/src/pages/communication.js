import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

import NavBar3 from "../components/navBar3.js";
import ScheduledEmails from "../components/ScheduledEmails.js";
import EmailEditor from "../components/emailEditor";
import * as actions from "../actions";
import { blankEmail } from "../templates/emailTemplates";

const Communication = (props) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    props.setLoaded(false);
    const event = await props.fetchEvent();
    props.setLoaded(true);
    if (event) {
      props.setLoaded(false);
      await props.fetchEmailList(event.data.id);
      props.setLoaded(true);
    }
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
  };

  const handleSubmitEditor = async () => {
    setOpenEditor(false);
    //props.setLoaded(false);
    console.log("closed, now we're going to fetch");
    const res = await props.fetchEmailList(props.event.id);
    console.log(res);
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
    await props.fetchEmailList(props.event.id);
    //props.setLoaded(true);
  };

  const handleDuplicateEmail = async (data) => {
    await props.addEmail(data);
    await props.fetchEmailList(props.event.id);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditor}
        onClose={handleCloseEditor}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
      >
        <EmailEditor
          handleClose={handleCloseEditor}
          handleSubmit={handleSubmitEditor}
          data={data}
        />
      </Modal>
      <NavBar3
        displaySideNav="true"
        content={
          <div>
            <ScheduledEmails
              handleAdd={handleAddEmail}
              handleDelete={handleDeleteEmail}
              handleEdit={handleEditEmail}
              handleDuplicate={handleDuplicateEmail}
            />
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { email: state.email, event: state.event };
};

export default connect(mapStateToProps, actions)(Communication);
