import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import NavBar3 from "../components/navBar3.js";
import Tabs from "../components/Tabs";
import Table from "../components/myEventsTable.js";
import * as actions from "../actions";

class My_Events extends React.Component {
  componentDidMount() {
    this.props.fetchEventList();
  }

  render() {
    return (
      <div>
        <NavBar3 displaySideNav="false" />
        <div className="myEventsContainer">
          <div className="myEventsHead">
            <h1 className="myEvents1">My Events</h1>
            <br></br>
            <Link to="/event-details">
              <button className="Button1 myEvents2">Create New Event</button>
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { eventList: state.eventList, event: state.event };
};

export default connect(mapStateToProps, actions)(My_Events);
