import axios from "axios";
import {
	FETCH_USER,
	FETCH_EVENT,
	FETCH_REG_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
} from "./types";
import { hero, banner } from "../components/regModel";

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

export const fetchRegModel = () => {
	console.log("fetch reg model called");
	// call the api and return the event in json
	const data = [
		{ index: 0, model: banner },
		{ index: 1, model: hero },
	];
	return { type: FETCH_REG_MODEL, payload: data };
};

export const updateSection = (sectionModel) => {
	// call the api and return the event in json
	return { type: UPDATE_SECTION, payload: sectionModel };
};

export const addSection = (previouIndex) => {
	console.log("add section action");
	// call the api and return the event in json
	// TODO need to figure out how to determine the index
	const data = { model: banner };
	return { type: ADD_SECTION, payload: data };
};
