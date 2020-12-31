import { FETCH_ATTENDEE } from "../actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_ATTENDEE:
      return action.payload || false;
    default:
      return state;
  }
}
