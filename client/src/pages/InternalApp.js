import React, { useEffect, createElement } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import * as actions from "../actions";

import Design from "./design";

import My_Events from "./my-events";
import Communication from "./communication";
import Registrations from "./registrations";
import Analytics from "./analytics";
import Messaging from "./messaging";
import License from "./license";
import EventDetailsPage from "./EventDetailsPage";
import AccountSettingsContact from "./account-settings-contact";
import AccountSettingsPayments from "./account-settings-payments";
import PageNotFound from "./PageNotFound";
import EventNotFound from "./EventNotFound";
import Polls from "./polls";
import Permissions from "./permissions";
import CreateEvent from "./CreateEvent";
import Dashboard from "./dashboard";
import FoldingCube from "../components/FoldingCube";

const InternalApp = ({ event, setCurrentEvent, fetchEvent }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetEventId = urlParams.get("eventid");
  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    if (targetEventId) {
      await setCurrentEvent(targetEventId);
    }

    fetchEvent();
  };

  const requireEvent = (component) => {
    // Doesn't render the component until the event is loaded into redux. This avoids any rendering errors with an empty event object.
    if (event.id) {
      return createElement(component);
    } else if (event.loaded) {
      return <EventNotFound />;
    } else {
      return (
        <div
          style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FoldingCube />
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Switch>
          <Route exact path="/create-event" component={CreateEvent} />
          <Route exact path="/" render={() => requireEvent(Dashboard)} />
          <Route exact path="/my-events" component={My_Events} />
          <Route
            exact
            path="/design/:page?"
            render={() => requireEvent(Design)}
          />
          <Route
            exact
            path="/event-details"
            render={() => requireEvent(EventDetailsPage)}
          />
          <Route
            exact
            path="/communication"
            render={() => requireEvent(Communication)}
          />
          <Route
            exact
            path="/registrations"
            component={Registrations}
            render={() => requireEvent(Registrations)}
          />
          <Route exact path="/polls" render={() => requireEvent(Polls)} />
          <Route
            exact
            path="/analytics"
            render={() => requireEvent(Analytics)}
          />
          <Route
            exact
            path="/messaging"
            render={() => requireEvent(Messaging)}
          />
          <Route exact path="/license" render={() => requireEvent(License)} />
          <Route
            exact
            path="/account-settings-contact"
            render={() => requireEvent(AccountSettingsContact)}
          />
          <Route
            exact
            path="/account-settings-payments"
            render={() => requireEvent(AccountSettingsPayments)}
          />
          <Route
            exact
            path="/permissions"
            render={() => requireEvent(Permissions)}
          />
          {/* Because we're using a switch, only one route will load. If the route doesn't match any of the routes above, display a page not found */}

          <Route component={PageNotFound} />
        </Switch>
      </header>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user, event: state.event };
};

export default connect(mapStateToProps, actions)(InternalApp);
