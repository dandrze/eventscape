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
import { fetchModelFromState, saveModel } from "./modelActions";

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
			showStreamSettings: false,
		},
		{
			html: descriptionRegistrationModel(start_date, end_date),
			name: "body",
			showStreamSettings: false,
		},
	];

	const event_page_model = [
		{
			html: logoHeaderRightModel(),
			name: "bannerRight",
			showStreamSettings: false,
		},
		{
			html: titleTimeModel(title, start_date, end_date),
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
		isLive: false,
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
		isLive: getState().event.is_live,
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

	const newEvent = { ...getState().event, is_live: true };

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
