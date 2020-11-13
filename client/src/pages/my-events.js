import React from "react";
import { Link } from "react-router-dom";
import NavBar3 from "../components/navBar3.js";
import Tabs from "../components/Tabs";
import Table from "../components/myEventsTable.js";

export default class My_Events extends React.Component {
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
						<div label="Upcoming Events">
							<div className="table1">
								<Table></Table>
							</div>
						</div>
						<div label="Past Events">
							<div className="table1">
								<Table></Table>
							</div>
						</div>
					</Tabs>
				</div>
			</div>
		);
	}
}
