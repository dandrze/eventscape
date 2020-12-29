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
import Login from "./pages/login";
import AccountSettingsContact from "./pages/account-settings-contact";
import AccountSettingsPassword from "./pages/account-settings-password";
import AccountSettingsPayments from "./pages/account-settings-payments";

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
    setDataFetched(true);
  };

  const RedirectToLogin = (props) => {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location },
        }}
      />
    );
  };

  if (
    path[0] !== "localhost:3000" &&
    path[0] !== "eventscape" &&
    path[0] !== "www"
  ) {
    return (
      <div className="App">
        <header className="App-header">
          <Route
            exact
            path="/"
            render={(props) => <Published {...props} subdomain={path[0]} />}
          />
          <Route
            path="/:hash"
            render={(props) => <Published {...props} subdomain={path[0]} />}
          />
        </header>
      </div>
    );
  }

  // middleware to redirect to the login page if the user is not logged in
  const requireAuth = (component) => {
    if (!dataFetched) {
      // if data is not done fetching during this rerender, don't return anything
      return null;
    } else if (!props.user) {
      // if data fetching is complete and there is no user (from the cookie) redirect to the login
      return RedirectToLogin;
    } else {
      // if the data is fetched and there is a user logged in (from the cookie) display the component
      return component;
    }
  };

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="App-header">
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/create-account" component={Create_Account} />
        <Route exact path="/dashboard" component={requireAuth(Dashboard)} />
        <Route
          exact
          path="/event-details"
          component={requireAuth(Event_Details)}
        />
        <Route exact path="/my-events" component={requireAuth(My_Events)} />
        <Route exact path="/design" component={requireAuth(Design)} />
        <Route
          exact
          path="/website-settings"
          component={requireAuth(WebsiteSettings)}
        />
        <Route
          exact
          path="/communication"
          component={requireAuth(Communication)}
        />
        <Route
          exact
          path="/registrations"
          component={requireAuth(Registrations)}
        />
        <Route exact path="/analytics" component={requireAuth(Analytics)} />
        <Route exact path="/messaging" component={requireAuth(Messaging)} />
        <Route
          exact
          path="/preview/:event/:model"
          component={requireAuth(Preview)}
        />
        <Route exact path="/ScotiabankGillerPrize" component={Giller} />
        <Route
          exact
          path="/account-settings-contact"
          component={requireAuth(AccountSettingsContact)}
        />
        <Route
          exact
          path="/account-settings-password"
          component={requireAuth(AccountSettingsPassword)}
        />
        <Route
          exact
          path="/account-settings-payments"
          component={requireAuth(AccountSettingsPayments)}
        />
      </header>
    </div>
  );
  //}
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(App);
