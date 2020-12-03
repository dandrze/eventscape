import {
	FETCH_REGISTRATION
} from "../actions/types";

export default function (state = [], action) {
	switch (action.type) {
		case FETCH_REGISTRATION:
			console.log(state);
			console.log(action.payload);
			return action.payload;
		default:
			return state;
	}
}
