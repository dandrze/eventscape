import axios from "axios";
import {
	SIGNIN_USER,
	FETCH_EVENTS,
	FETCH_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	CREATE_EVENT,
	CHANGE_PAGE_EDITOR,
	MOVE_SECTION,
	DELETE_SECTION,
	SAVE_REG_MODEL,
	SAVE_EVENT_MODEL,
	MODEL_ISSAVED,
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
) => async (dispatch) => {
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
		{
			id: Math.random(),
			sectionHtml: streamChatModel(),
			name: "streamChat",
			showStreamSettings: true,
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

	const event = {
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
	};

	const res = await axios.post("/api/events", event);

	console.log(res);

	dispatch({
		type: CREATE_EVENT,
		payload: event,
	});
};

export const fetchEvents = () => async (dispatch) => {
	// call the api and return the event in json

	console.log("fetch events called");

	const events = await axios.get("/api/events");

	// if there are events, go to design page
	if (events) {
		dispatch({ type: FETCH_EVENTS, payload: events.data });
	} else {
		// if no events then go to create event page
		console.log("no events");
		return null;
	}
};

// MODEL ACTIONS

export const fetchPageModel = () => (dispatch, getState) => {
	let model = [];

	console.log(getState().event);

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

export const saveModel = () => async (dispatch, getState) => {
	// copy the model over to the event object
	await dispatch(localSaveModel());

	// call the new event object
	// call the first event for now
	const event = getState().event[0];
	console.log(event);

	// save the new event object to database
	const res = await axios.post("/api/events", event);

	console.log(res);
};

export const localSaveModel = () => (dispatch, getState) => {
	const currentPage = getState().settings.nowEditingPage;
	const currentModel = getState().model;

	switch (currentPage) {
		case "registration":
			dispatch({ type: SAVE_REG_MODEL, payload: currentModel });
			dispatch({ type: MODEL_ISSAVED, payload: currentModel });
			break;
		case "event":
			dispatch({ type: SAVE_EVENT_MODEL, payload: currentModel });
			dispatch({ type: MODEL_ISSAVED, payload: currentModel });
			break;
	}
};

// SETTINGS ACTIONS

export const changePageEditor = (pageName) => {
	return { type: CHANGE_PAGE_EDITOR, payload: pageName };
};
