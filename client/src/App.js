import React from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "./logo.svg";
import "./App.css";
import { Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing";
import Create_Account from "./pages/create-account";
import Event_Details from "./pages/event-details";
import My_Events from "./pages/my-events";
import Design from "./pages/design";
import Communication from "./pages/communication";
import EmailEditor from "./pages/emailEditor";
import Registrations from "./pages/registrations";
import Analytics from "./pages/analytics";
import Preview from "./pages/preview";
import Published from "./pages/published";
import * as actions from "./actions";
import WebsiteSettings from "./pages/websiteSettings";
import Giller from "./pages/Giller";

function App() {
	const path = window.location.host.split(".");

	if (
		path[0] !== "localhost:3000" &&
		path[0] !== "eventscape" &&
		path[0] !== "www"
	) {
		return (
			<div className="App">
				<header className="App-header">
					<Published subdomain={path[0]} />
				</header>
			</div>
		);
	}

	return (
		<div className="App">
			<ToastContainer position="top-right" autoClose={3000} />
			<header className="App-header">
				<Route exact path="/" component={Landing} />
				{/*<Route exact path="/Dashboard" component={Dashboard} />*/}
				{/*<Route exact path="/Create_Account" component={Create_Account} />*/}
				{/*<Route exact path="/Event_Details" component={Event_Details} />*/}
				{/*<Route exact path="/My_Events" component={My_Events} />*/}
				{/*<Route exact path="/Design" component={Design} />*/}
				{/*<Route exact path="/WebsiteSettings" component={WebsiteSettings} />*/}
				{/*<Route exact path="/Communication" component={Communication} />*/}
				{/*<Route exact path="/CommunicationEditor" component={EmailEditor} />*/}
				{/*<Route exact path="/Registrations" component={Registrations} />*/}
				{/*<Route exact path="/Analytics" component={Analytics} />*/}
				{/*<Route exact path="/Preview" component={Preview} />*/}
				<Route exact path="/ScotiabankGillerPrize" component={Giller} />
			</header>
		</div>
	);
}

export default connect(null, actions)(App);
