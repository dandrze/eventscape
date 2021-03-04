import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal1 from "../components/Modal1";
import AlertModal from "../components/AlertModal";
import NavBar3 from "../components/navBar3.js";
import PollsTable from "../components/polling/PollsTable.js";
import * as actions from "../actions";
import PollBuilder from "../components/polling/PollBuilder";
import { CircularProgress } from "@material-ui/core";
import api from "../api/server";
import PollController from "../components/polling/PollController";

const Polls = ({ event, polls, fetchPolls }) => {
  const [open, setOpen] = useState(false);
  const [openPoll, setOpenPoll] = useState(false);
  const [dataFetched, setDataFetched] = useState(true);
  const [isAddPoll, setIsAddPoll] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [pollData, setPollData] = useState({});

  useEffect(() => {
    fetchDatAsync();
  }, [event]);

  //Separated function because useEffect should not be an async function
  const fetchDatAsync = async () => {
    setDataFetched(false);
    if (event.id) {
      await fetchPolls(event.id);
    }
    setDataFetched(true);
  };

  const handleAddPoll = () => {
    setIsAddPoll(true);
    setOpen(true);
  };

  const handleEditPoll = (rowData) => {
    setPollData(rowData);
    setIsAddPoll(false);
    setOpen(true);
  };

  const handleCloseBuilder = () => {
    setOpen(false);
    fetchDatAsync();
  };

  const handleDeletePoll = async (pollId) => {
    const res = await api.delete("/api/polling/poll", { params: { pollId } });
    fetchDatAsync();
  };

  const handleLaunchPoll = () => {
    console.log(polls);
    if (polls.length) {
      setOpenPoll(true);
    } else {
      setOpenAlert(true);
    }
  };

  const handleClosePoll = () => {
    setOpenPoll(false);
  };

  return (
    <div>
      <Modal1
        open={open}
        onClose={handleCloseBuilder}
        content={
          <PollBuilder
            handleClose={handleCloseBuilder}
            isAdd={isAddPoll}
            pollData={pollData}
          />
        }
        title={isAddPoll ? "Create a new poll" : "Edit poll"}
      />
      <Modal1
        open={openPoll}
        onClose={handleClosePoll}
        content={<PollController handleClose={handleClosePoll} />}
      />

      <AlertModal
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        content={
          <>
            <div>Oops, it looks like you haven't created any polls yet! </div>
            <br></br>
            <div>
              You can create a new poll by clicking on the icon in the top right
              of the polls table.
            </div>
          </>
        }
        closeText="OK"
      />

      <NavBar3
        displaySideNav="true"
        highlight="polls"
        content={
          <div className="container-width">
            <div className="top-button-bar">
              <button
                className="Button1 button-bar-right"
                style={{ marginLeft: "auto" }}
                onClick={handleLaunchPoll}
              >
                Launch Polll
              </button>
            </div>
            {dataFetched ? (
              <PollsTable
                handleAdd={handleAddPoll}
                data={polls}
                handleEdit={handleEditPoll}
                handleDelete={handleDeletePoll}
              />
            ) : (
              <CircularProgress />
            )}
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
    polls: state.polls,
  };
};

export default connect(mapStateToProps, actions)(Polls);
