import axios from "axios";
import {
	SIGNIN_USER,
	FETCH_EVENTS,
	FETCH_PAGE_MODEL,
	CREATE_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	CREATE_EVENT,
	CHANGE_PAGE_EDITOR,
	MOVE_SECTION,
	DELETE_SECTION,
} from "./types";
import {
	logoHeaderModel,
	logoHeaderRightModel,
	heroBannerModel,
	descriptionRegistrationModel,
	titleTimeModel,
	streamChatModel,
	blankModel,
} from "../components/designBlockModels";

// USER ACTIONS

export const signinUser = () => async (dispatch) => {
	//const res = await axios.get("/api/current_user");

	const data = {
		id: 1,
		name: "Demo User",
		email: "demo@demo.com",
	};

	dispatch({ type: SIGNIN_USER, payload: "res.data" });
};

// EVENT ACTIONS

export const createEvent = (
	title,
	link,
	category,
	startDate,
	endDate,
	timeZone,
	primaryColor
) => {
	const regPageModel = [
		{ id: Math.random(), sectionHtml: logoHeaderModel(), name: "banner" },
		{
			id: Math.random(),
			sectionHtml: heroBannerModel(title, primaryColor),
			name: "heroBanner",
			showStreamSettings: false,
		},
		{
			id: Math.random(),
			sectionHtml: descriptionRegistrationModel(startDate, endDate),
			name: "body",
			showStreamSettings: false,
		},
	];

	const eventPageModel = [
		{
			id: Math.random(),
			sectionHtml: logoHeaderRightModel(),
			name: "bannerRight",
			showStreamSettings: false,
		},
		{
			id: Math.random(),
			sectionHtml: titleTimeModel(title, startDate, endDate),
			name: "titleTime",
			showStreamSettings: false,
		},
		{
			id: Math.random(),
			sectionHtml: streamChatModel(),
			name: "streamChat",
			showStreamSettings: true,
		},
		{
			id: Math.random(),
			sectionHtml: blankModel(),
			name: "blankModel",
			showStreamSettings: false,
		},
	];

	const id = Math.random();

	return {
		type: CREATE_EVENT,
		payload: {
			id,
			title,
			link,
			category,
			startDate,
			endDate,
			timeZone,
			primaryColor,
			regPageModel,
			eventPageModel,
		},
	};
};

export const fetchEvents = () => {
	// call the api and return the event in json

	const events = false;

	// if there are events, go to design page
	if (events) {
		return { type: FETCH_EVENTS, payload: events };
	} else {
		// if no events then go to create event page
		return null;
	}
};

// MODEL ACTIONS

export const createModel = (eventTitle, color, eventStartDate) => {
	// call the api and return the model in json
	const data = [
		{ id: Math.random(), sectionHtml: logoHeaderModel(), name: "banner" },
		{
			id: Math.random(),
			sectionHtml: heroBannerModel(eventTitle),
			name: "heroBanner",
		},
		{
			id: Math.random(),
			sectionHtml: descriptionRegistrationModel(eventStartDate),
			name: "body",
		},
	];

	return { type: CREATE_PAGE_MODEL, payload: data };
};

export const fetchPageModel = () => (dispatch, getState) => {
	let model = [];

	try {
		switch (getState().settings.nowEditingPage) {
			case "registration":
				model = getState().event[0].regPageModel;
				break;
			case "event":
				model = getState().event[0].eventPageModel;
				break;
		}
	} catch {
		console.log("event is empty");
	}

	dispatch({ type: FETCH_PAGE_MODEL, payload: model });
};

export const updateSection = (index, sectionHtml) => {
	// call the api and return the event in json
	const payload = {
		index,
		sectionHtml,
	};
	return { type: UPDATE_SECTION, payload };
};

export const addSection = (prevIndex, sectionHtml, sectionName) => {
	// call the api and return the event in json

	const payload = {
		index: prevIndex + 1,
		model: { id: Math.random(), sectionHtml, sectionName },
	};

	return { type: ADD_SECTION, payload };
};

export const deleteSection = (index) => {
	return { type: DELETE_SECTION, payload: { index } };
};

export const moveSection = (index, offset) => {
	return { type: MOVE_SECTION, payload: { index, offset } };
};

// SETTINGS ACTIONS

export const changePageEditor = (pageName) => {
	return { type: CHANGE_PAGE_EDITOR, payload: pageName };
};
