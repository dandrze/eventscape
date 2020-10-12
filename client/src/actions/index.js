import axios from "axios";
import {
	FETCH_USER,
	FETCH_EVENT,
	FETCH_PAGE_MODEL,
	CREATE_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	CREATE_EVENT,
} from "./types";
import { hero, body, banner } from "../components/regModel";

export const fetchUser = () => async (dispatch) => {
	//const res = await axios.get("/api/current_user");

	dispatch({ type: FETCH_USER, payload: "res.data" });
};

export const fetchEvents = () => {
	// call the api and return the event in json
	//return { type: FETCH_EVENT, payload: data };
};

export const createModel = (eventTitle) => {
	// call the api and return the model in json
	console.log("create model");
	const data = [
		{ id: Math.random(), html: banner(), name:"banner" },
		{ id: Math.random(), html: hero("Event Title prop"), name:"hero" },
		{ id: Math.random(), html: body(), name:"body" },
	];

	return { type: CREATE_PAGE_MODEL, payload: data };
};

export const fetchPageModel = () => {
	// call the api and return the event in json
	// we're using Math.random() for now for a unique id. Once we hook up the db, we'll use the db id instead
	return { type: FETCH_PAGE_MODEL, payload: "" };
};

export const updateSection = (index, html) => {
	// call the api and return the event in json
	const payload = {
		index, html
	}
	return { type: UPDATE_SECTION, payload };
};

export const addSection = (prevIndex, html) => {
	// call the api and return the event in json
	console.log("add section")
	console.log(html);
	
	const payload = {
		index: prevIndex + 1,
		model: { id: Math.random(), html, name: "banner" },
	};

	return { type: ADD_SECTION, payload };
};
