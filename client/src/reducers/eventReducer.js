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
		savedPageModel: { regPageModel: [], eventPageModel: [] },
		loaded: false,
	},
	action
) {
	switch (action.type) {
		case CREATE_EVENT:
			// commented out for now as we only have one event
			//return [...state, action.payload];
			return { ...action.payload, loaded: true };
		case FETCH_EVENT:
			return { ...action.payload, loaded: true };
		case SAVE_REG_MODEL:
			return {
				...state,
				savedPageModel: {
					...state.savedPageModel,
					regPageModel: action.payload,
				},
			};

		case SAVE_EVENT_MODEL:
			return {
				...state,
				savedPageModel: {
					...state.savedPageModel,
					eventPageModel: action.payload,
				},
			};
		case PUBLISH_REG_MODEL:
			return {
				...state,
				livePageModel: {
					...state.livePageModel,
					regPageModel: action.payload,
				},
			};

		case PUBLISH_EVENT_MODEL:
			return {
				...state,
				livePageModel: {
					...state.livePageModel,
					eventPageModel: action.payload,
				},
			};
		default:
			return state;
	}
}
