import {
	FETCH_EVENTS,
	CREATE_EVENT,
	UPDATE_REG_PAGE_MODEL,
	ADD_SECTION_REG_PAGE,
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
			return [...state, action.payload];
		case FETCH_EVENTS:
			console.log(action.payload);
			return action.payload;
		case UPDATE_REG_PAGE_MODEL:
			return state.map((event, index) => {
				if (event.id === action.payload.eventId) {
					return {
						...event,
						regPageModel: event.regPageModel.map((section, index) => {
							if (index === action.payload.index) {
								return { ...section, sectionHtml: action.payload.sectionHtml };
							}
							return section;
						}),
					};
				}
				return event;
			});
		case ADD_SECTION_REG_PAGE:
			return state.map((event, index) => {
				if (event.id === action.payload.eventId) {
					return {
						...event,
						regPageModel: [
							...event.regPageModel.slice(0, action.payload.index),
							action.payload.model,
							...event.regPageModel.slice(action.payload.index),
						],
					};
				}
				return event;
			});
			return [
				...state.slice(0, action.payload.index),
				action.payload.model,
				...state.slice(action.payload.index),
			];
		default:
			return state;
	}
}
