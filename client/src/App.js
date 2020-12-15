import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import logo from "./logo.svg";
import "./App.css";
import "./components/fonts.css";
import { Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing";
import Create_Account from "./pages/create-account";
import Event_Details from "./pages/event-details";
import My_Events from "./pages/my-events";
import Design from "./pages/design";
import Communication from "./pages/communication";
import Registrations from "./pages/registrations";
import Analytics from "./pages/analytics";
import Messaging from "./pages/messaging";
import Preview from "./pages/preview";
import Published from "./pages/published";
import * as actions from "./actions";
import WebsiteSettings from "./pages/websiteSettings";
import Giller from "./pages/Giller";
import Test from "./pages/test";

//import "froala-editor/css/froala_style.min.css";

function App(props) {
  const path = window.location.host.split(".");
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
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
    } else {
      fetchDataAsync();
    }
  }, []);

  const fetchDataAsync = async () => {
    setDataFetched(await props.fetchEvent());
  };

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="App-header">
        <Route exact path="/" component={Landing} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/create-account" component={Create_Account} />
        <Route exact path="/event-details" component={Event_Details} />
        <Route exact path="/my-events" component={My_Events} />
        <Route exact path="/design" component={Design} />
        <Route exact path="/website-settings" component={WebsiteSettings} />
        <Route exact path="/communication" component={Communication} />
        <Route exact path="/registrations" component={Registrations} />
        <Route exact path="/analytics" component={Analytics} />
        <Route exact path="/messaging" component={Messaging} />
        <Route exact path="/preview/:event/:model" component={Preview} />
        <Route exact path="/ScotiabankGillerPrize" component={Giller} />
        <Route exact path="/test" component={Test} />
      </header>
    </div>
  );
}

export default connect(null, actions)(App);
