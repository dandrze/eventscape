import { FETCH_EVENT } from "../actions/types";

export default function (state = null, action) {
	console.log("reducer called");
	console.log(state);
	switch (action.type) {
		case FETCH_EVENT:
			console.log("fetch_event called");
			return action.payload;
		default:
			return state;
	}
}
