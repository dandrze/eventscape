import { FETCH_EVENT, CREATE_EVENT, UPDATE_EVENT } from "../actions/types";

export default function (state = {}, action) {
	switch (action.type) {
		case CREATE_EVENT:
			// commented out for now as we only have one event
			//return [...state, action.payload];
			return {
				...action.payload,
			};
		case FETCH_EVENT:
			return {
				...action.payload,
			};
		case UPDATE_EVENT:
			return {
				...action.payload,
			};
		default:
			return state;
	}
}
