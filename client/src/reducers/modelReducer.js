import {
	UPDATE_PAGE_MODEL,
	FETCH_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	MOVE_SECTION,
	DELETE_SECTION,
	MODEL_ISSAVED,
} from "../actions/types";

export default function (
	state = { isUnsaved: false, status: 0, sections: [] },
	action
) {
	switch (action.type) {
		case UPDATE_SECTION:
			return {
				...state,
				isUnsaved: true,
				sections: state.sections.map((section, index) => {
					if (index === action.payload.index) {
						return { ...section, html: action.payload.html };
					}
					return section;
				}),
			};
		case ADD_SECTION:
			return {
				...state,
				isUnsaved: true,
				sections: [
					...state.sections.slice(0, action.payload.index),
					action.payload.model,
					...state.sections.slice(action.payload.index),
				],
			};
		case DELETE_SECTION:
			return {
				...state,
				isUnsaved: true,
				sections: state.sections.filter(
					(item, index) => index !== action.payload.index
				),
			};
		case MOVE_SECTION:
			const newSections = state.sections.slice();
			newSections[action.payload.index] =
				state.sections[action.payload.index + action.payload.offset];
			newSections[action.payload.index + action.payload.offset] =
				state.sections[action.payload.index];
			return { isUnsaved: true, sections: newSections };
		case FETCH_PAGE_MODEL:
			return {
				isUnsaved: false,
				sections: action.payload,
			};
		case MODEL_ISSAVED:
			return { ...state, isUnsaved: false };
		default:
			return state;
	}
}

const insertItem = (array, item, index) => {
	return [...array.slice(0, index), item, ...array.slice(index)];
};
