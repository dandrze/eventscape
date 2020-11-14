import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT_LIST } from "./types";

export const fetchEventList = () => async (dispatch) => {
	// call the api and return the event in json
	const eventList = await api.get("/api/event/all");

	// if there are events
	if (eventList) {
		dispatch({ type: FETCH_EVENT_LIST, payload: eventList.data });
	}
};
