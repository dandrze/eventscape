import "./polyfills";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import reducers from "./reducers";
//import global variables
import "./global";

var store;
if (process.env.NODE_ENV == "production") {
  store = createStore(reducers, applyMiddleware(thunk));
} else {
  // if the environmet is not production, show the redux dev tools
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#B0281C",
    },
    secondary: {
      main: "#B0281C",
    },
  },
  typography: {
    fontFamily: "Roboto, 'Helvetica Neue', Ariel, sans-serif",
    fontWeight: "300",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
