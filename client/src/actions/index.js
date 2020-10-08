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
	// call the api and return the event in json
	const data = [
		{ name: "event name 1", date: "event date 1" },
		{ name: "event name 2", date: "event date 2" },
		{ name: "event name 3", date: "event date 3" },
	];
	return { type: FETCH_EVENT, payload: data };
};

export const fetchRegModel = () => {
	// call the api and return the event in json
	// we're using Math.random() for now for a unique id. Once we hook up the db, we'll use the db id instead
	const data = [
		{ id: Math.random(), model: banner },
		{ id: Math.random(), model: hero },
	];
	return { type: FETCH_REG_MODEL, payload: data };
};

export const updateSection = (sectionModel) => {
	// call the api and return the event in json
	return { type: UPDATE_SECTION, payload: sectionModel };
};

export const addSection = (previouIndex) => {
	// call the api and return the event in json
	const data = { id: Math.random(), model: banner };
	return { type: ADD_SECTION, payload: data };
};
