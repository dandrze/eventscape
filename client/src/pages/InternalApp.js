import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import * as actions from "../actions";

import Design from "./design";

import Dashboard from "./dashboard";
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
import PageNotFound from "./PageNotFound";
import Polls from "./polls";
import Test from "./test";

const InternalApp = ({ fetchEvent, user }) => {
  useEffect(() => {
    fetchEvent();
    initTawk();
  }, [user]);

  console.log(process.env.REACT_APP_TAWK_URL);

  const initTawk = () => {
    // initializes the tawk.to chat support widget
    if (!window) {
      throw new Error("DOM is unavailable");
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const tawk = document.getElementById("tawkId");
    if (tawk) {
      // Prevent TawkTo to create root script if it already exists
      return window.Tawk_API;
    }

    window.Tawk_API.visitor = {
      email: user.emailAddress || "",
      name: user.firstName ? `${user.firstName} ${user.lastName}` : "",
    };

    const script = document.createElement("script");
    script.id = "tawkId";
    script.async = true;
    script.src = process.env.REACT_APP_TAWK_URL;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    const first_script_tag = document.getElementsByTagName("script")[0];
    if (!first_script_tag || !first_script_tag.parentNode) {
      throw new Error("DOM is unavailable");
    }

    first_script_tag.parentNode.insertBefore(script, first_script_tag);
  };

  return (
    <div className="App">
      <div id="accountId" style={{ display: "none" }}>
        123
      </div>
      <header className="App-header">
        <Switch>
          <Route exact path="/" component={Design} />
          <Route exact path="/event-details" component={Event_Details} />
          <Route exact path="/my-events" component={My_Events} />
          <Route exact path="/design/:page?" component={Design} />
          <Route exact path="/website-settings" component={WebsiteSettings} />
          <Route exact path="/communication" component={Communication} />
          <Route exact path="/registrations" component={Registrations} />
          <Route exact path="/polls" component={Polls} />
          <Route exact path="/analytics" component={Analytics} />
          <Route exact path="/messaging" component={Messaging} />
          <Route exact path="/preview/:event/:model" component={Preview} />
          <Route
            exact
            path="/account-settings-contact"
            component={AccountSettingsContact}
          />
          <Route
            exact
            path="/account-settings-password"
            component={AccountSettingsPassword}
          />
          <Route
            exact
            path="/account-settings-payments"
            component={AccountSettingsPayments}
          />
          {/*<Route exact path="/test" component={Test} />*/}
          {/* Because we're using a switch, only one route will load. If the route doesn't match any of the routes above, display a page not found */}
          <Route component={PageNotFound} />
        </Switch>
      </header>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(InternalApp);
