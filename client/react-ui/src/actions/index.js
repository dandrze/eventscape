import axios from "axios";
import { FETCH_USER, FETCH_EVENT } from "./types";

export const fetchUser = () => async (dispatch) => {
	//const res = await axios.get("/api/current_user");

	dispatch({ type: FETCH_USER, payload: "res.data" });
};

export const fetchEvents = () => {
	console.log("fetch events called");
	// call the api and return the event in json
	const data = [
		{ name: "event name 1", date: "event date 1" },
		{ name: "event name 2", date: "event date 2" },
		{ name: "event name 3", date: "event date 3" },
	];
	return { type: FETCH_EVENT, payload: data };
};
