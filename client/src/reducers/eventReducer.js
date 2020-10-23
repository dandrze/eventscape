import {
	FETCH_EVENTS,
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

export default function (state = [], action) {
	switch (action.type) {
		case CREATE_EVENT:
			// commented out for now as we only have one event
			//return [...state, action.payload];
			return [action.payload];
		case FETCH_EVENTS:
			return action.payload;
		case SAVE_REG_MODEL:
			return state.map((event, index) => {
				// the index search will be used to save the model to relevant event
				if (index === 0) {
					return {
						...event,
						regPageModel: action.payload,
					};
				}
			});
		case SAVE_EVENT_MODEL:
			return state.map((event, index) => {
				// the index search will be used to save the model to relevant event
				if (index === 0) {
					return {
						...event,
						eventPageModel: action.payload,
					};
				}
			});
		default:
			return state;
	}
}
