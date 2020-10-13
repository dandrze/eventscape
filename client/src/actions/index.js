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
import {logoHeaderModel, heroBannerModel, descriptionRegistrationModel } from '../components/regModel'

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
	console.log(eventTitle);
	const data = [
<<<<<<< HEAD
		{ id: Math.random(), sectionHtml: logoHeaderModel(), name:"banner" },
		{ id: Math.random(), sectionHtml: heroBannerModel(eventTitle), name:"heroBanner" },
		{ id: Math.random(), sectionHtml: descriptionRegistrationModel(), name:"body" },
=======
		{ id: Math.random(), html: banner() },
		{ id: Math.random(), html: hero("Event Title") },
		{ id: Math.random(), html: body() },
>>>>>>> kevin4
	];

	return { type: CREATE_PAGE_MODEL, payload: data };
};

export const fetchPageModel = () => {
	// call the api and return the event in json
	// we're using Math.random() for now for a unique id. Once we hook up the db, we'll use the db id instead
	return { type: FETCH_PAGE_MODEL, payload: "" };
};

export const updateSection = (index, sectionHtml) => {
	// call the api and return the event in json
	const payload = {
		index, sectionHtml
	}
	return { type: UPDATE_SECTION, payload };
};

export const addSection = (prevIndex, sectionHtml, sectionName) => {
	// call the api and return the event in json
	console.log("add section")
	console.log(sectionHtml);
	
	const payload = {
		index: prevIndex + 1,
		model: { id: Math.random(), sectionHtml, sectionName},
	};

	return { type: ADD_SECTION, payload };
};
