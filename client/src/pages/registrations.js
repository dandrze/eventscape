import React, { useEffect } from "react";
import { connect } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch1 from "../components/switch";
import Tooltip from "@material-ui/core/Tooltip";

import "./registrations.css";

import NavBar3 from "../components/navBar3.js";
import RegistrationTable2 from "../components/RegistrationTable2.js";
import * as actions from "../actions";

const Registrations = (props) => {
  // UseEffect mimicks OnComponentDidMount
  // get the list of registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);

  //Separated function because useEffect should not be an async function
  const fetchRegistrations = async () => {
    const event = await props.fetchEvent();
    props.fetchRegistrations(event.data.id);
  };

  const [regOn, setRegOn] = React.useState({
    checked: true,
  });

  const handleChange = (event) => {
    if (props.setEventRegistration(event.target.checked, props.event.id)) {
      setRegOn({ ...regOn, [event.target.name]: event.target.checked });
    }
  };

  return (
    <div>
      <NavBar3
        displaySideNav="true"
        content={
          <div className="container-width">
            <div id="topButtons">
              <Tooltip title="If registration is off, attendees will go directly to the event page and no registration data will be collected.">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch1
                        checked={regOn.checked}
                        onChange={handleChange}
                        name="checked"
                      />
                    }
                    label="Registration On"
                  />
                </FormGroup>
              </Tooltip>
              <button className="Button1 edit-form">
                Edit Registration Form
              </button>
            </div>
            <RegistrationTable2 />
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
  return {
    eventList: state.eventList,
    settings: state.settings,
    event: state.event,
  };
};

export default connect(mapStateToProps, actions)(Registrations);
