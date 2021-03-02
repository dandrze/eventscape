import React, { lazy, Suspense, useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./App.css";
import "./components/fonts.css";
import LongLoadingScreen from "./components/LongLoadingScreen";
import * as actions from "./actions";

// lazy loading is used so only the relevant component is loaded rather than all components
const Landing = lazy(() => import("./pages/landing"));
const Create_Account = lazy(() => import("./pages/create-account"));
const Published = lazy(() => import("./pages/published"));
const Giller = lazy(() => import("./pages/Giller"));
const Login = lazy(() => import("./pages/login"));
const ResetPassword = lazy(() => import("./pages/password-reset"));
const ChangePassword = lazy(() => import("./pages/change-password"));
const InternalApp = lazy(() => import("./pages/InternalApp"));

function App(props) {
  const path = window.location.host.split(".");

  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!props.user) fetchDataAsync();
  }, []);

  const fetchDataAsync = async () => {
    if (!dataFetched) {
      await props.fetchUser();
    }

    setDataFetched(true);
  };

  // middleware to redirect to the login page if the user is not logged in
  const requireAuth = () => {
    if (!dataFetched) {
      // if data is not done fetching during this rerender, don't return anything
      return <LongLoadingScreen text="Fetching your account..." />;
    } else if (!props.user) {
      // if data fetching is complete and there is no user (from the cookie) redirect to the login
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
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
          <InternalApp />{" "}
        </Suspense>
      );
    }
  };

  if (path[0] === "app") {
    return (
      <div className="App">
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
              <Route exact path="/create-account" component={Create_Account} />
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

              {/* Because we're using a switch, only one route will load. If the route doesn't match any of the public routes, then go to the internal app*/}
              <Route component={requireAuth} />
            </Switch>
          </Suspense>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
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
  return { user: state.user };
};

export default connect(mapStateToProps, actions)(App);
