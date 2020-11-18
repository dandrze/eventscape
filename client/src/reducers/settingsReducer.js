import {
	CHANGE_PAGE_EDITOR,
	LOAD_STARTED,
	LOAD_FINISHED,
} from "../actions/types";

export default function (
	state = { nowEditingPage: "registration", loaded: false },
	action
) {
	switch (action.type) {
		case CHANGE_PAGE_EDITOR:
			return { ...state, nowEditingPage: action.payload };
		case LOAD_STARTED:
			return { ...state, loaded: false };
		case LOAD_FINISHED:
			return { ...state, loaded: true };
		default:
			return state;
	}
}
