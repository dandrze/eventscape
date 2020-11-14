import { toast } from "react-toastify";
import api from "../api/server";
import {
	logoHeaderModel,
	logoHeaderRightModel,
	heroBannerModel,
	descriptionRegistrationModel,
	titleTimeModel,
	streamChatModel,
	blankModel,
} from "../components/designBlockModels";
import { FETCH_EVENT, CREATE_EVENT, UPDATE_EVENT } from "./types";
import { fetchPageModel, saveModel } from "./modelActions";

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

	const res = await api.post("/api/event", event);

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
	startDate,
	endDate,
	timeZone,
	primaryColor
) => async (dispatch, getState) => {
	const updatedEvent = {
		title,
		link,
		category,
		startDate,
		endDate,
		timeZone,
		primaryColor,
		regPageIsLive: getState().event.reg_page_is_live,
		eventPageIsLive: getState().event.event_page_is_live,
	};

	console.log(updatedEvent);

	const res = await api.put("/api/event", updatedEvent);

	console.log(res);

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
	const event = await api.get("/api/event/current");

	console.log(event);

	// if there are events, go to design page
	if (event) {
		dispatch({ type: FETCH_EVENT, payload: event.data });
		dispatch(fetchPageModel());
		return event;
	} else {
		// if no events then go to create event page
		console.log("no events");
		return null;
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

	const res = await api.put("/api/event", newEvent);

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
