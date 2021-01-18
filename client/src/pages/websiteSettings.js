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
                <Event_Details
                  isEventUpdate={true}
                  eventTitle={this.props.event.title}
                  eventCat={this.props.event.category}
                  eventLink={this.props.event.link}
                  selectedStartDate={this.props.event.startDate}
                  selectedEndDate={this.props.event.endDate}
                  color={this.props.event.primaryColor}
                  eventTimeZone={this.props.event.timeZone}
                />
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
