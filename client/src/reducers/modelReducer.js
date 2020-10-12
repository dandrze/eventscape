import {
	UPDATE_PAGE_MODEL,
	FETCH_PAGE_MODEL,
	CREATE_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
} from "../actions/types";

export default function (state = [], action) {
	switch (action.type) {
		case CREATE_PAGE_MODEL:
			console.log(action.payload);
			return action.payload;
		case UPDATE_SECTION:
			console.log(action.payload.html)
			state[action.payload.index].html = action.payload.html;
			console.log(state);
			return state;
		case ADD_SECTION:
			return insertItem(state, action.payload.model, action.payload.index);
		case FETCH_PAGE_MODEL:
			return state;
		default:
			return state;
	}
}

const insertItem = (array, item, index) => {
	return [...array.slice(0, index), item, ...array.slice(index)];
};
