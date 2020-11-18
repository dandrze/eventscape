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
import {
	FETCH_EVENT,
	CREATE_EVENT,
	UPDATE_EVENT,
	LOAD_STARTED,
	LOAD_FINISHED,
} from "./types";
import {
	fetchModelFromId,
	fetchModelFromState,
	saveModel,
} from "./modelActions";
import { model } from "mongoose";

export const createEvent = (
	title,
	link,
	category,
	start_date,
	end_date,
	time_zone,
	primary_color
) => async (dispatch) => {
	const reg_page_model = [
		{ html: logoHeaderModel(), name: "banner" },
		{
			html: heroBannerModel(title, primary_color),
			name: "heroBanner",
			is_stream: false,
		},
		{
			html: descriptionRegistrationModel(start_date, end_date),
			name: "body",
			is_stream: false,
		},
	];

	const event_page_model = [
		{
			html: logoHeaderRightModel(),
			name: "bannerRight",
			is_stream: false,
		},
		{
			html: titleTimeModel(title, start_date, end_date),
			name: "titleTime",
			is_stream: false,
		},
		{
			html: streamChatModel(),
			name: "streamChat",
			is_stream: true,
		},
		{
			html: blankModel(),
			name: "blankModel",
			is_stream: false,
		},
	];

	console.log(typeof start_date);

	const event = {
		title,
		link,
		category,
		start_date,
		end_date,
		time_zone,
		primary_color,
		reg_page_model,
		event_page_model,
		status: 0,
	};

	const res = await api.post("/api/event", event);

	if (res.status === 201) {
		await dispatch({
			type: CREATE_EVENT,
			payload: res.data,
		});

		await dispatch(fetchModelFromState());
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
		status: getState().event.status,
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
	dispatch({ type: LOAD_STARTED });
	const event = await api.get("/api/event/current");
	dispatch({ type: LOAD_FINISHED });

	if (event) {
		dispatch({ type: FETCH_EVENT, payload: event.data });
		dispatch(fetchModelFromState());
		return event;
	} else {
		console.log("no events");
		return null;
	}
};

export const publishPage = () => async (dispatch, getState) => {
	// save the model
	await dispatch(saveModel());

	const newEvent = { ...getState().event, status: 1 };

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

export const isLinkAvailable = (link) => async (dispatch) => {
	const res = await api.get("/api/model/link", { params: { link } });

	if (res.data.length == 0) {
		return true;
	} else {
		return false;
	}
};
