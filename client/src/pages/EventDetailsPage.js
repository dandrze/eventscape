import React from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import NavBar3 from "../components/navBar3.js";
import EventDetailsForm from "../components/EventDetailsForm";
import MissingPermissionsScreen from "../components/MissingPermissionsScreen";

class WebsiteSettings extends React.Component {
  render() {
    return (
      <div>
        <NavBar3
          displaySideNav="true"
          highlight="event-details"
          content={
            this.props.event.id ? (
              this.props.event.permissions?.eventDetails ? (
                <div className="form-width">
                  <EventDetailsForm isEventUpdate={true} />
                </div>
              ) : (
                <MissingPermissionsScreen />
              )
            ) : (
              <CircularProgress style={{ marginTop: "30vh" }} />
            )
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { event: state.event };
};

export default connect(mapStateToProps, null)(WebsiteSettings);
