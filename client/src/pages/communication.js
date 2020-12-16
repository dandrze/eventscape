import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";

import NavBar3 from "../components/navBar3.js";
import ScheduledEmails from "../components/ScheduledEmails.js";
import EmailEditor from "../components/emailEditor";
import * as actions from "../actions";

const Communication = (props) => {
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const event = await props.fetchEvent();
    if (event) {
      props.fetchEmailList(event.data.id);
    }
    console.log("fetch data called");
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
  };

  const handleSubmitEditor = () => {
    setOpenEditor(false);
    fetchData();
  };

  const handleOpenEditor = () => {
    setOpenEditor(true);
  };

  const handleDeleteEmail = async (id) => {
    await props.deleteEmail(id);
    fetchData();
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
        />
      </Modal>
      <NavBar3
        displaySideNav="true"
        content={
          <div>
            <ScheduledEmails
              key={props.email}
              handleAdd={handleOpenEditor}
              handleDelete={handleDeleteEmail}
            />
            <div style={{ color: "#F8F8F8" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
        }
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { email: state.email };
};

export default connect(mapStateToProps, actions)(Communication);
