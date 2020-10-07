import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import reducers from "./reducers";

const store = createStore(reducers);

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
		fontFamily: "San Francisco, Helvetica, Ariel, sans-serif",
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
