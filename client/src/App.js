import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import logo from "./logo.svg";
import "./App.css";
import "./components/fonts.css";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (
      path[0] !== "localhost:3000" ||
      path[0] !== "eventscape" ||
      path[0] !== "www"
    ) {
      fetchDataAsync();
    }
  }, []);

  const fetchDataAsync = async () => {
    await props.fetchUser();
    await props.fetchEvent();
    //setDataFetched(true);
  };

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

  console.log(dataFetched);
  console.log(props.user);

  // while we are fetching data, display the spinner
  if (!dataFetched) {
    return (
      <div style={{ textAlign: "center", paddingTop: "150px" }}>
        <CircularProgress />
      </div>
    );
  } else if (!props.user) {
    // if there is no user fetched (no cookie present to automatically log the user in), send them to the login page
    return (
      <div className="App">
        <header className="App-header">
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
          <Route exact path="/login" component={Create_Account} />
        </header>
      </div>
    );
  } else {
    // else, if the data is fetched and there is a user, render the app
    // note everything in this block is private and requires authentication
    return (
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="App-header">
          <Route exact path="/" component={Landing} />
          <Route exact path="/dashboard" component={Dashboard} />
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
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(App);
