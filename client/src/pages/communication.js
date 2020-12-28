import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";

import NavBar3 from "../components/navBar3.js";
import ScheduledEmails from "../components/ScheduledEmails.js";
import EmailEditor from "../components/emailEditor";
import * as actions from "../actions";
import { blankEmail } from "../templates/emailTemplates";
import { statusOptions } from "../model/enums";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "0px",
  },
}));

const Communication = (props) => {
  const classes = useStyles();

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
      await props.fetchCommunicationList(event.data.id);
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
    const res = await props.fetchCommunicationList(props.event.id);
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
    await props.fetchCommunicationList(props.event.id);
    //props.setLoaded(true);
  };

  const handleDuplicateEmail = async (data) => {
    await props.addEmail({ ...data, status: statusOptions.DRAFT });
    await props.fetchCommunicationList(props.event.id);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openEditor}
        onClose={handleCloseEditor}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
      >
        <Fade in={openEditor}>
          <div className={classes.paper}>
            <EmailEditor
              handleClose={handleCloseEditor}
              handleSubmit={handleSubmitEditor}
              data={data}
            />
          </div>
        </Fade>
      </Modal>
      <NavBar3
        displaySideNav="true"
        highlight="communication"
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
