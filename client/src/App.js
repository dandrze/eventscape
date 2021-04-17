import React, { lazy, Suspense, useState, useEffect, createElement } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import CookieConsent from "react-cookie-consent";

import "./App.css";
import "./components/fonts.css";
import LongLoadingScreen from "./components/LongLoadingScreen";
import * as actions from "./actions";
import initTawk from "./utils/tawk";

// lazy loading is used so only the relevant component is loaded rather than all components
const Landing = lazy(() => import("./pages/landing"));
const Create_Account = lazy(() => import("./pages/create-account"));
const Published = lazy(() => import("./pages/published"));
const Giller = lazy(() => import("./pages/Giller"));
const Login = lazy(() => import("./pages/login"));
const ResetPassword = lazy(() => import("./pages/password-reset"));
const ChangePassword = lazy(() => import("./pages/change-password"));
const InternalApp = lazy(() => import("./pages/InternalApp"));
const Admin = lazy(() => import("./pages/Admin"));

function App({ user, location, fetchUser, attendee }) {
  const path = window.location.host.split(".");
  const urlParams = new URLSearchParams(window.location.search);
  const targetEventId = urlParams.get("eventid");

  const [dataFetched, setDataFetched] = useState(false);

  const isApp = path[0] === "app";

  const tawkPropertyIdForApp = "60560b08f7ce182709322202";
  const tawkKeyForApp = "1f181m7nl";

  useEffect(() => {
    if (!user.id) fetchDataAsync();
  }, []);

  useEffect(() => {
    if (isApp) {
      initTawk(
        user.emailAddress || "",
        user.firstName || "guest",
        user.lastName || "",
        tawkPropertyIdForApp,
        tawkKeyForApp
      );
    } else {
      // can initialize a chat app on the event page if needed
    }
  }, [user, attendee]);

  const fetchDataAsync = async () => {
    if (!dataFetched) {
      await fetchUser();
    }

    setDataFetched(true);
  };

  // middleware to redirect to the login page if the user is not logged in
  const requireAuth = () => {
    if (!dataFetched) {
      // if data is not done fetching during this rerender, don't return anything
      return <LongLoadingScreen text="Fetching your account..." />;
    } else if (!user.id) {
      // if data fetching is complete and there is no user (from the cookie) redirect to the login
      return (
        <Redirect
          to={{
            pathname: "/login",
            search: targetEventId ? `?eventid=${targetEventId}` : "",
            state: { from: location },
          }}
        />
      );
    } else {
      // if the data is fetched and there is a user logged in (from the cookie) display the component
      // While the app loads, display the long loading screen
      return (
        <Suspense
          fallback={
            <LongLoadingScreen text="Hang tight! We're getting everything ready for you..." />
          }
        >
          <InternalApp />
        </Suspense>
      );
    }
  };

  const requireAdmin = (component) => {

    console.log(user)
    if(user.type === "admin"){
      return createElement(component);
    }
  }

  if (isApp) {
    // it's an app (rather than an event page) so render the app components
    return (
      <div className="App">
        <CookieConsent
          location="bottom"
          buttonText="I accept"
          cookieName="CookieConsent"
          style={{ padding: "0px 100px" }}
          buttonStyle={{
            color: "#ffffff",
            backgroundColor: "#b0281c",
            fontSize: "13px",
          }}
        >
          By continuing to use this site, or by clicking "I Accept", you
          acknowledge and agree to this website's use of cookies to improve the
          user experience and to track performance and analytics.
        </CookieConsent>

        <ToastContainer position="top-right" autoClose={3000} />
        <header className="App-header">
          <Suspense
            fallback={
              <div
                style={{
                  backgroundColor: "#f8f8f8",
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            }
          >
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route
                exact
                path="/create-account/:email?"
                component={Create_Account}
              />
              <Route exact path="/reset-password" component={ResetPassword} />
              <Route exact path="/ScotiabankGillerPrize" component={Giller} />
              <Route
                exact
                path="/change-password/:token"
                component={ChangePassword}
              />
              <Route
                exact
                path="/testlivepage"
                render={(props) => <Published {...props} subdomain="test" />}
              />

              <Route exact path="/admin" render={() => requireAdmin(Admin)}/>

              {/* Because we're using a switch, only one route will load. If the route doesn't match any of the public routes, then go to the internal app*/}
              <Route component={requireAuth} />
            </Switch>
          </Suspense>
        </header>
      </div>
    );
  } else {
    // is not the app, therefore is an event
    return (
      <div className="App">
        <CookieConsent
          location="bottom"
          buttonText="I accept"
          cookieName="CookieConsent"
          style={{ padding: "0px 100px" }}
          buttonStyle={{
            color: "#ffffff",
            backgroundColor: "#b0281c",
            fontSize: "13px",
          }}
        >
          By continuing to use this site, or by clicking "I Accept", you
          acknowledge and agree to this website's use of cookies to improve the
          user experience and to track performance and analytics.
        </CookieConsent>
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="App-header">
          <Suspense
            fallback={
              <div
                style={{
                  backgroundColor: "#f8f8f8",
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            }
          >
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
}

const mapStateToProps = (state) => {
  return { user: state.user, attendee: state.attendee };
};

export default connect(mapStateToProps, actions)(App);
