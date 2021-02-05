import React, { useEffect, useState, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as actions from "../actions";

import Design from "./design";
import LongLoadingScreen from "../components/LongLoadingScreen";

import Dashboard from "./dashboard";
import Landing from "./landing";
import Event_Details from "./event-details";
import My_Events from "./my-events";
import Communication from "./communication";
import Registrations from "./registrations";
import Analytics from "./analytics";
import Messaging from "./messaging";
import Preview from "./preview";
import WebsiteSettings from "./websiteSettings";
import AccountSettingsContact from "./account-settings-contact";
import AccountSettingsPassword from "./account-settings-password";
import AccountSettingsPayments from "./account-settings-payments";

const InternalApp = (props) => {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="App-header">
        <Route exact path="/app/dashboard" component={Dashboard} />
        <Route exact path="/app/event-details" component={Event_Details} />
        <Route exact path="/app/my-events" component={My_Events} />
        <Route exact path="/app/design/:page?" component={Design} />
        <Route exact path="/app/website-settings" component={WebsiteSettings} />
        <Route exact path="/app/communication" component={Communication} />
        <Route exact path="/app/registrations" component={Registrations} />
        <Route exact path="/app/analytics" component={Analytics} />
        <Route exact path="/app/messaging" component={Messaging} />
        <Route exact path="/app/preview/:event/:model" component={Preview} />
        <Route
          exact
          path="/app/account-settings-contact"
          component={AccountSettingsContact}
        />
        <Route
          exact
          path="/app/account-settings-password"
          component={AccountSettingsPassword}
        />
        <Route
          exact
          path="/app/account-settings-payments"
          component={AccountSettingsPayments}
        />
      </header>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(InternalApp);
