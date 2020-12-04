import {
  FETCH_EVENT_LIST,
  DELETE_EVENT,
  DUPLICATE_EVENT,
} from "../actions/types";

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_EVENT_LIST:
      return action.payload;
    case DELETE_EVENT:
      return [...action.payload];
    case DUPLICATE_EVENT:
      return [...action.payload];
    default:
      return state;
  }
}
