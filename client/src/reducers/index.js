import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userReducer from "./userReducer";
import eventReducer from "./eventReducer";
import modelReducer from "./modelReducer";
import settingsReducer from "./settingsReducer";
import eventListReducer from "./eventListReducer";
import registrationReducer from "./registrationReducer";
import emailReducer from "./emailReducer";
import attendeeReducer from "./attendeeReducer";
import pollingReducer from "./pollingReducer";

export default combineReducers({
  user: userReducer,
  form: formReducer,
  event: eventReducer,
  model: modelReducer,
  settings: settingsReducer,
  eventList: eventListReducer,
  registration: registrationReducer,
  email: emailReducer,
  attendee: attendeeReducer,
  polling: pollingReducer,
});
