import axios from "axios";
import { toast } from "react-toastify";

import {
	SIGNIN_USER,
	FETCH_EVENT,
	FETCH_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	CREATE_EVENT,
	UPDATE_EVENT,
	CHANGE_PAGE_EDITOR,
	MOVE_SECTION,
	DELETE_SECTION,
	SAVE_REG_MODEL,
	SAVE_EVENT_MODEL,
	PUBLISH_REG_MODEL,
	PUBLISH_EVENT_MODEL,
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
		{ html: logoHeaderModel(), name: "banner" },
		{
			html: heroBannerModel(title, primaryColor),
			name: "heroBanner",
			showStreamSettings: false,
		},
		{
			html: descriptionRegistrationModel(startDate, endDate),
			name: "body",
			showStreamSettings: false,
		},
		{
			html: streamChatModel(),
			name: "streamChat",
			showStreamSettings: true,
		},
	];

	const eventPageModel = [
		{
			html: logoHeaderRightModel(),
			name: "bannerRight",
			showStreamSettings: false,
		},
		{
			html: titleTimeModel(title, startDate, endDate),
			name: "titleTime",
			showStreamSettings: false,
		},
		{
			html: streamChatModel(),
			name: "streamChat",
			showStreamSettings: true,
		},
		{
			html: blankModel(),
			name: "blankModel",
			showStreamSettings: false,
		},
	];

	const event = {
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
		regPageModel,
		eventPageModel,
		regPageLive: false,
		eventPageLive: false,
	};

	const res = await axios.post("/api/events", event);

	if (res.status === 201) {
		await dispatch({
			type: CREATE_EVENT,
			payload: res.data,
		});

		await dispatch(fetchPageModel());
	} else {
		toast.error("Error when saving: " + res.statusText);
	}
};

export const updateEvent = (
	title,
	link,
	category,
	start_date,
	end_date,
	time_zone,
	primary_color
) => async (dispatch, getState) => {
	const updatedEvent = {
		title,
		link,
		category,
		start_date,
		end_date,
		time_zone,
		primary_color,
		reg_page_is_live: getState().event.reg_page_is_live,
		event_page_is_live: getState().event.event_page_is_live,
	};

	const res = await axios.put("/api/event", updatedEvent);

	if (res.status === 200) {
		await dispatch({
			type: UPDATE_EVENT,
			payload: res.data,
		});
	} else {
		toast.error("Error when saving: " + res.statusText);
	}
};

export const fetchEvent = () => async (dispatch) => {
	// call the api and return the event in json
	const event = await axios.get("/api/events/current");

	console.log(event);

	// if there are events, go to design page
	if (event) {
		dispatch({ type: FETCH_EVENT, payload: event.data });
		return event;
	} else {
		// if no events then go to create event page
		console.log("no events");
		return null;
	}
};

export const fetchPublishedPage = (pageLink) => async (dispatch) => {
	const event = await axios.get("/api/page?link=" + pageLink);
	console.log(event.data);
	if (event) {
		dispatch({ type: FETCH_EVENT, payload: event.data });
		return event;
	} else {
		return null;
	}
};

// MODEL ACTIONS

export const fetchPageModel = () => async (dispatch, getState) => {
	var modelId;
	try {
		switch (getState().settings.nowEditingPage) {
			case "registration":
				modelId = getState().event.reg_page_model;
				break;
			case "event":
				modelId = getState().event.event_page_model;
				break;
		}

		console.log(modelId);

		const model = await axios.get("/api/model", { params: { id: modelId } });

		dispatch({ type: FETCH_PAGE_MODEL, payload: model.data });
	} catch {
		console.log("event is empty");
	}
};

export const updateSection = (index, html) => {
	// call the api and return the event in json
	const payload = {
		index,
		html,
	};
	return { type: UPDATE_SECTION, payload };
};

export const addSection = (prevIndex, html, sectionName) => {
	// call the api and return the event in json

	const payload = {
		index: prevIndex + 1,
		model: { id: Math.random(), html, sectionName },
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

	const model = getState().model.sections;

	console.log(model);

	// save the new model
	const res = await axios.put("/api/model", { model });

	if (res.status === 200) {
		toast.success("Page successfully saved");
	} else {
		toast.error("Error when saving: " + res.statusText);
	}
};

export const localSaveModel = () => (dispatch, getState) => {
	const currentPage = getState().settings.nowEditingPage;
	const currentModel = getState().model.sections;

	switch (currentPage) {
		case "registration":
			dispatch({ type: SAVE_REG_MODEL, payload: currentModel });
			dispatch({ type: MODEL_ISSAVED });
			break;
		case "event":
			dispatch({ type: SAVE_EVENT_MODEL, payload: currentModel });
			dispatch({ type: MODEL_ISSAVED });
			break;
	}
};

export const publishPage = () => async (dispatch, getState) => {
	const currentPage = getState().settings.nowEditingPage;

	// save the model
	await dispatch(saveModel());

	var newEvent = {};

	switch (currentPage) {
		case "registration":
			newEvent = { ...getState().event, reg_page_is_live: true };
			break;
		case "event":
			newEvent = { ...getState().event, event_page_is_live: true };
			break;
	}

	const res = await axios.put("/api/event", newEvent);

	if (res.status === 200) {
		await dispatch({
			type: UPDATE_EVENT,
			payload: res.data,
		});
		toast.success("Page successfully published");
	} else {
		toast.error("Error when saving: " + res.statusText);
	}
};

// SETTINGS ACTIONS

export const changePageEditor = (pageName) => {
	return { type: CHANGE_PAGE_EDITOR, payload: pageName };
};
