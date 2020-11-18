import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT_LIST, LOAD_STARTED, LOAD_FINISHED } from "./types";

export const fetchEventList = () => async (dispatch) => {
	// call the api and return the event in json

	dispatch({ type: LOAD_STARTED });
	const eventList = await api.get("/api/event/all");
	dispatch({ type: LOAD_FINISHED });

	// if there are events
	if (eventList) {
		dispatch({ type: FETCH_EVENT_LIST, payload: eventList.data });
	}
};

export const duplicateEvent = (id, link) => async (dispatch) => {
	const res1 = await api.get("/api/event/id", { params: { id } });
	const newEvent = { ...res1.data, link: link };
	const res2 = await api.post("/api/event", newEvent);
	toast.success("Event successfully duplicated");
	return true;
};

export const deleteEvent = (id) => async (dispatch) => {
	const res = await api.delete("/api/event/id", { params: { id } });
	console.log(res);
	toast.success("Event successfully deleted");
	return true;
};

export const setCurrentEvent = (id) => async (dispatch) => {
	const res = await api.put("/api/event/id/make-current", { id });

	return true;
};
