import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userReducer from "./userReducer";
import eventReducer from "./eventReducer";

export default combineReducers({
	userReducer: userReducer,
	form: formReducer,
	event: eventReducer,
});
