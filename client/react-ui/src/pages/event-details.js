import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import { Link } from "react-router-dom";

class Event_Details extends React.Component {
	// calls the fetch event as a test
	componentDidMount() {
		this.props.fetchEvents();
	}

	render() {
		return (
			<div>
				<h1>My Event Details</h1>
				<div className="form-box">
					<form>
						<label for="title">Event Title</label>
						<br></br>
						<input
							type="text"
							id="title"
							name="title"
							placeholder="ie. Event X or Gala Y"
						></input>
						<br></br>
						<label for="event-link">Event Link</label>
						<br></br>
						<input
							type="text"
							id="event-link"
							name="event-link"
							placeholder="myevent"
						></input>
						<br></br>
						<label for="event-type">Event Type</label>
						<br></br>
						<select name="event-type" id="event-type">
							<option value="" disabled selected hidden>
								Select the type of event
							</option>
							<option value="Press Conference">Press Conference</option>
							<option value="Conference">Conference</option>
							<option value="Performance">Performance</option>
							<option value="Festival">Festival</option>
						</select>
						<br></br>
						<div className="row-50-l">
							<label for="start-date">Start Date</label>
							<br></br>
							<input
								type="date"
								id="start-date"
								name="start-date"
								placeholder="yyyy-mm-dd"
							></input>
						</div>
						<div className="row-50-r">
							<label for="start-time">Start Time</label>
							<br></br>
							<input
								type="time"
								id="start-time"
								name="start-time"
								placeholder="7:00 PM"
							></input>
							<br></br>
						</div>
						<br></br>
						<div className="row-50-l">
							<label for="end-date">End Date</label>
							<br></br>
							<input
								type="date"
								id="end-date"
								name="end-date"
								placeholder="yyyy-mm-dd"
							></input>
						</div>
						<div className="row-50-r">
							<label for="end-time">End Time</label>
							<br></br>
							<input
								type="time"
								id="end-time"
								name="end-time"
								placeholder="9:00 PM"
							></input>
							<br></br>
						</div>
						<br></br>
					</form>
					<Link to="/Design">
						<button className="Button1">Create My Event</button>
					</Link>
				</div>
			</div>
		);
	}
}

export default connect(null, actions)(Event_Details);
