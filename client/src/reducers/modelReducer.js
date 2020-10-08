import {
	UPDATE_REG_MODEL,
	FETCH_REG_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
} from "../actions/types";

export default function (state = [""], action) {
	switch (action.type) {
		case UPDATE_SECTION:
			return action.payload;
		case ADD_SECTION:
			return [...state, action.payload];
		case FETCH_REG_MODEL:
			return action.payload;
		default:
			return state;
	}
}
