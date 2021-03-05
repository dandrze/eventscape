import {
  FETCH_POLLS,
  SELECT_POLL_BY_INDEX,
  FETCH_RESULTS,
} from "../actions/types";

export default function (
  state = { polls: [], selectedPollIndex: 0, results: [], totalResponded: 0 },
  action
) {
  switch (action.type) {
    case FETCH_POLLS:
      return { ...state, polls: action.payload };
    case SELECT_POLL_BY_INDEX:
      return { ...state, selectedPollIndex: action.payload };
    case FETCH_RESULTS:
      return {
        ...state,
        results: action.payload.results,
        totalResponded: action.payload.totalResponded,
      };
    default:
      return state;
  }
}
