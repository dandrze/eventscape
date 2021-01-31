import React, { useEffect, useState, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./App.css";
import "./components/fonts.css";
import * as actions from "./actions";

// lazy loading is used so only the relevant component is loaded rather than all components
const Dashboard = lazy(() => import("./pages/dashboard"));
const Landing = lazy(() => import("./pages/landing"));
const Create_Account = lazy(() => import("./pages/create-account"));
const Event_Details = lazy(() => import("./pages/event-details"));
const My_Events = lazy(() => import("./pages/my-events"));
const Design = lazy(() => import("./pages/design"));
const Communication = lazy(() => import("./pages/communication"));
const Registrations = lazy(() => import("./pages/registrations"));
const Analytics = lazy(() => import("./pages/analytics"));
const Messaging = lazy(() => import("./pages/messaging"));
const Preview = lazy(() => import("./pages/preview"));
const Published = lazy(() => import("./pages/published"));
const WebsiteSettings = lazy(() => import("./pages/websiteSettings"));
const Giller = lazy(() => import("./pages/Giller"));
const Login = lazy(() => import("./pages/login"));
const AccountSettingsContact = lazy(() =>
  import("./pages/account-settings-contact")
);
const AccountSettingsPassword = lazy(() =>
  import("./pages/account-settings-password")
);
const AccountSettingsPayments = lazy(() =>
  import("./pages/account-settings-payments")
);
const ResetPassword = lazy(() => import("./pages/password-reset"));
const ChangePassword = lazy(() => import("./pages/change-password"));
const Test = lazy(() => import("./pages/test"));

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

  console.log(process.env.NODE_ENV);
  console.log(process.env.PIPELINE_ENV);
  alert(process.env.NODE_ENV);
  alert(process.env.PIPELINE_ENV);

  if (
    path[0] !== "localhost:3000" &&
    path[0] !== "eventscape" &&
    path[0] !== "www"
  ) {
    return (
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="App-header">
          <Suspense fallback={<CircularProgress />}>
            <Route
              exact
              path="/"
              render={(props) => <Published {...props} subdomain={path[0]} />}
            />
            <Route
              path="/:hash"
              render={(props) => <Published {...props} subdomain={path[0]} />}
            />
          </Suspense>
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
        <Suspense fallback={<CircularProgress />}>
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
          <Route exact path="/design/:page?" component={requireAuth(Design)} />
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
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route
            exact
            path="/change-password/:token"
            component={ChangePassword}
          />
          <Route exact path="/test" component={Test} />
        </Suspense>
      </header>
    </div>
  );
  //}
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(App);
