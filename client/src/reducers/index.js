import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userReducer from "./userReducer";
import eventReducer from "./eventReducer";
import modelReducer from "./modelReducer";
import settingsReducer from "./settingsReducer"

export default combineReducers({
	user: userReducer,
	form: formReducer,
	event: eventReducer,
	model: modelReducer,
	settings: settingsReducer,
});
