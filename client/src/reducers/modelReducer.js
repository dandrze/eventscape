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
			console.log(state);

			return state.map((section, index) => {
				if(index === action.payload.index) {
					return {...section, sectionHtml: action.payload.sectionHtml}
				}
				return section;
			})
		case ADD_SECTION:
			return [...state.slice(0, action.payload.index), action.payload.model, ...state.slice(action.payload.index)]
		case FETCH_PAGE_MODEL:
			return state;
		default:
			return state;
	}
}

const insertItem = (array, item, index) => {
	return [...array.slice(0, index), item, ...array.slice(index)];
};
