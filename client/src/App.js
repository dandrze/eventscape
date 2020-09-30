import React from "react";
import logo from "./icons/logo.svg";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing";
import Create_Account from "./pages/create-account";
import Event_Details from "./pages/event-details";
import My_Events from "./pages/my-events";
import Design from "./pages/design";
import Registrations from "./pages/registrations";
import { connect } from "react-redux";
import * as actions from "./actions";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<BrowserRouter>
					<Route exact path="/" component={Landing} />
					<Route exact path="/Dashboard" component={Dashboard} />
					<Route exact path="/Create_Account" component={Create_Account} />
					<Route exact path="/Event_Details" component={Event_Details} />
					<Route exact path="/My_Events" component={My_Events} />
					<Route exact path="/Design" component={Design} />
					<Route exact path="/Registrations" component={Registrations} />
				</BrowserRouter>
			</header>
		</div>
	);
}

export default connect(null, actions)(App);
