import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import NavBar3 from "../components/navBar3.js";
import Tabs from "../components/Tabs";
import Table from "../components/myEventsTable.js";
import * as actions from "../actions";
import "./my-events.css";

const My_Events = (props) => {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    props.setLoaded(false);
    await props.fetchEventList();
    props.setLoaded(true);
  };

  return (
    <div>
      <NavBar3 displaySideNav="false" openBlocked="true" content={
      <div className="my-events-container">
        <div className="top-button-bar">
          <h1 className="button-bar-left my-events-title">My Events</h1>
          <br></br>
          <Link to="/event-details" className="button-bar-right">
            <button className="Button1">Create New Event</button>
          </Link>
        </div>
        <Tabs>
          <div label="Upcoming">
            <div className="table1">
              <Table tab="upcoming"></Table>
            </div>
          </div>
          <div label="Past">
            <div className="table1">
              <Table tab="past"></Table>
            </div>
          </div>
          <div label="Deleted">
            <div className="table1">
              <Table tab="deleted"></Table>
            </div>
          </div>
        </Tabs>
      </div>}/>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { eventList: state.eventList, event: state.event };
};

export default connect(mapStateToProps, actions)(My_Events);
