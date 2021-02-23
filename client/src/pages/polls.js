import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal1 from "../components/Modal1";

import "./registrations.css";

import NavBar3 from "../components/navBar3.js";
import PollsTable from "../components/PollsTable.js";
import * as actions from "../actions";
import PollBuilder from "../components/PollBuilder";
import RegistrationForm from "../components/pageReactSections/RegistrationForm";
import { toast } from "react-toastify";
import ImportFile from "../components/ImportFile";
import { CircularProgress } from "@material-ui/core";

const Polls = (props) => {
  const [open, setOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(true);

  useEffect(() => {
    fetchDatAsync();
  }, [props.event]);

  //Separated function because useEffect should not be an async function
  const fetchDatAsync = async () => {
    setDataFetched(false);
    if (props.event.id) {
      await props.fetchPolls(props.event.id);
    }
    setDataFetched(true);
  };

  const handleAddPoll = () => {
    setOpen(true);
  };

  const handleCloseBuilder = () => {
    setOpen(false);
    fetchDatAsync();
  };

  return (
    <div>
      <Modal1
        open={open}
        onClose={handleCloseBuilder}
        content={<PollBuilder handleClose={handleCloseBuilder} />}
        title="Create a new poll"
      />

      <NavBar3
        displaySideNav="true"
        highlight="polls"
        content={
          <div className="container-width">
            {dataFetched ? (
              <PollsTable handleAdd={handleAddPoll} data={props.polls} />
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
