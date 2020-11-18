import {
	CHANGE_PAGE_EDITOR,
	LOAD_STARTED,
	LOAD_FINISHED,
	SET_SIDE_DRAWER_OPEN,
} from "../actions/types";

export default function (
	state = { nowEditingPage: "event", loaded: false, sideDrawerOpen: true },
	action
) {
	switch (action.type) {
		case CHANGE_PAGE_EDITOR:
			return { ...state, nowEditingPage: action.payload };
		case LOAD_STARTED:
			return { ...state, loaded: false };
		case LOAD_FINISHED:
			return { ...state, loaded: true };
		case SET_SIDE_DRAWER_OPEN:
			return { ...state, sideDrawerOpen: action.payload };
		default:
			return state;
	}
}
