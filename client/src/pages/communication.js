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
    props.fetchEmailList(props.event.id);
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
    await props.deleteEmail(id);
    props.fetchEmailList(props.event.id);
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
              key={props.email}
              handleAdd={handleAddEmail}
              handleDelete={handleDeleteEmail}
              handleEdit={handleEditEmail}
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
  return { email: state.email, event: state.event };
};

export default connect(mapStateToProps, actions)(Communication);
