import { CHANGE_PAGE_EDITOR } from "../actions/types";

export default function (state = {nowEditingPage: "registration"}, action) {
	switch (action.type) {
		case CHANGE_PAGE_EDITOR:
			return {...state, nowEditingPage: action.payload};

		default:
			return state;
	}
}
