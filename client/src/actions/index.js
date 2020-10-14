import axios from "axios";
import {
	SIGNIN_USER,
	FETCH_EVENTS,
	FETCH_PAGE_MODEL,
	CREATE_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	CREATE_EVENT,
} from "./types";
import {logoHeaderModel, heroBannerModel, descriptionRegistrationModel } from '../components/regModel'

// USER ACTIONS

export const signinUser = () => async (dispatch) => {
	//const res = await axios.get("/api/current_user");

	const data = {
		id: 1,
		name: "Demo User",
		email: "demo@demo.com"
	}

	dispatch({ type: SIGNIN_USER, payload: "res.data" });
};

// EVENT ACTIONS

export const createEvent = (title, link, category, startDate, endDate, timeZone, primaryColor) => {

	const regPageModel = [
		{ id: Math.random(), sectionHtml: logoHeaderModel(), name:"banner" },
		{ id: Math.random(), sectionHtml: heroBannerModel(title), name:"heroBanner" },
		{ id: Math.random(), sectionHtml: descriptionRegistrationModel(startDate), name:"body" },
	];

	const id = Math.random();

	return {type: CREATE_EVENT, payload: {
		id, title, link, category, startDate, endDate, timeZone, primaryColor, regPageModel
	}}
}

export const fetchEvents = () => {
	// call the api and return the event in json

	const events = false;

	// if there are events, go to design page
	if (events) {
	return { type: FETCH_EVENTS, payload: events };
	} else {
		// if no events then go to create event page
		return null
	}
};


// MODEL ACTIONS

export const createModel = (eventTitle, color, eventStartDate) => {
	// call the api and return the model in json
	console.log(eventTitle);
	const data = [
		{ id: Math.random(), sectionHtml: logoHeaderModel(), name:"banner" },
		{ id: Math.random(), sectionHtml: heroBannerModel(eventTitle), name:"heroBanner" },
		{ id: Math.random(), sectionHtml: descriptionRegistrationModel(eventStartDate), name:"body" },
	];

	return { type: CREATE_PAGE_MODEL, payload: data };
};

export const fetchPageModel = () => {
	// call the api and return the event in json
	// we're using Math.random() for now for a unique id. Once we hook up the db, we'll use the db id instead
	return { type: FETCH_PAGE_MODEL, payload: "" };
};

export const updateSection = (eventId, index, sectionHtml) => {
	// call the api and return the event in json
	const payload = {
		index, sectionHtml, eventId
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
