import {
	FETCH_EVENT,
	CREATE_EVENT,
	SAVE_REG_MODEL,
	SAVE_EVENT_MODEL,
	PUBLISH_REG_MODEL,
	PUBLISH_EVENT_MODEL,
} from "../actions/types";

export default function (
	state = {
		regPageModel: [],
		eventPageModel: [],
		loaded: false,
		regPageLive: false,
		eventPageLive: false,
	},
	action
) {
	switch (action.type) {
		case CREATE_EVENT:
			// commented out for now as we only have one event
			//return [...state, action.payload];
			return {
				...action.payload,
				loaded: true,
			};
		case FETCH_EVENT:
			return {
				...action.payload,
				loaded: true,
			};
		case SAVE_REG_MODEL:
			return {
				...state,
				regPageModel: action.payload,
			};

		case SAVE_EVENT_MODEL:
			return {
				...state,
				eventPageModel: action.payload,
			};
		case PUBLISH_REG_MODEL:
			return {
				...state,
				regPageLive: true,
			};

		case PUBLISH_EVENT_MODEL:
			return {
				...state,
				eventPageLive: true,
			};
		default:
			return state;
	}
}
