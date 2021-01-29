import React from "react";

import NavBar3 from "../components/navBar3.js";
import Event_Details from "./event-details";
import { connect } from "react-redux";

class WebsiteSettings extends React.Component {
  render() {
    return (
      <div>
        <NavBar3
          displaySideNav="true"
          highlight="event-details"
          content={
            <div>
              <div className="form-width">
                {this.props.event.id ? (
                  <Event_Details isEventUpdate={true} />
                ) : null}
              </div>
            </div>
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
