import { FETCH_COMMUNICATION_LIST } from "../actions/types";

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_COMMUNICATION_LIST:
      console.log("reducer called");
      return action.payload;
    default:
      return state;
  }
}
