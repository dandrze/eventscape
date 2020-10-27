import {
	FETCH_EVENT,
	CREATE_EVENT,
	UPDATE_REG_PAGE_MODEL,
	ADD_SECTION_REG_PAGE,
	SAVE_REG_MODEL,
	SAVE_EVENT_MODEL,
} from "../actions/types";

/*
event = [
	{	
		id: 12312
		title: "Event Title",
		link: "eventLink"
		category: "category",
		startDate: "Feb 8, 2020",
		endDate: "feb 9, 2020",
		regPageModel: [
			{
				id: 123,
				sectionHTML: "<HTML>"
			},
			{
				id: 1456,
				sectionHTML: "<HTML>"
			},
		]
	}
]

*/

export default function (
	state = { regPageModel: [], eventPageModel: [], loaded: false },
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
				regPageModel: action.payload,
			};

		case SAVE_EVENT_MODEL:
			return {
				...state,
				eventPageModel: action.payload,
			};
		default:
			return state;
	}
}
