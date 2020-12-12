import { FETCH_REGISTRATION, FETCH_FORM } from "../actions/types";

export default function (state = { data: [], columns: [] }, action) {
  switch (action.type) {
    case FETCH_REGISTRATION:
      return { ...state, data: action.payload };
    case FETCH_FORM:
      return { ...state, columns: action.payload };
    default:
      return state;
  }
}
