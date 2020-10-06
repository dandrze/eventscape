import { UPDATE_REG_MODEL, FETCH_REG_MODEL } from "../actions/types";

export default function (state = null, action) {
	switch (action.type) {
		case UPDATE_REG_MODEL:
			console.log("design reducer called");
			return action.payload;
		case FETCH_REG_MODEL:
			console.log(action.payload);
			return action.payload;
		default:
			return state;
	}
}
