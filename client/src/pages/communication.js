import React, { useEffect } from "react";
import { connect } from "react-redux";
import NavBar3 from "../components/navBar3.js";
import ScheduledEmails from "../components/ScheduledEmails.js";
import * as actions from "../actions";

const Communication = (props) => {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const event = await props.fetchEvent();
    if (event) {
      props.fetchEmailList(event.data.id);
    }
  };

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        content={
          <div>
            <ScheduledEmails key={props.email} />
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
