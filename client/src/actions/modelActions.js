import { toast } from "react-toastify";
import api from "../api/server";

import {
	FETCH_PAGE_MODEL,
	ADD_SECTION,
	UPDATE_SECTION,
	MOVE_SECTION,
	DELETE_SECTION,
	SAVE_REG_MODEL,
	SAVE_EVENT_MODEL,
	MODEL_ISSAVED,
} from "./types";

export const fetchPublishedPage = (pageLink) => async (dispatch) => {
	const model = await api.get("/api/page", { params: { link: pageLink } });

	dispatch({ type: FETCH_PAGE_MODEL, payload: model.data });
};

export const fetchModelFromState = () => async (dispatch, getState) => {
	var modelId;
	try {
		switch (getState().settings.nowEditingPage) {
			case "registration":
				modelId = getState().event.reg_page_model;
				break;
			case "event":
				modelId = getState().event.event_page_model;
				break;
		}

		const model = await api.get("/api/model/id", { params: { id: modelId } });

		dispatch({ type: FETCH_PAGE_MODEL, payload: model.data });
	} catch {
		console.log("event is empty");
	}
};

export const fetchModelFromId = (id) => async (dispatch) => {
	const model = await api.get("/api/model/id", { params: { id } });

	dispatch({ type: FETCH_PAGE_MODEL, payload: model.data });
};

export const fetchModelFromLink = (link) => async (dispatch) => {
	const model = await api.get("/api/model/link", { params: { link } });

	dispatch({ type: FETCH_PAGE_MODEL, payload: model.data });
};

export const updateSection = (index, html) => {
	// call the api and return the event in json
	const payload = {
		index,
		html,
	};
	return { type: UPDATE_SECTION, payload };
};

export const addSection = (prevIndex, html, sectionName) => {
	// call the api and return the event in json

	const payload = {
		index: prevIndex + 1,
		model: { id: Math.random(), html, sectionName },
	};

	return { type: ADD_SECTION, payload };
};

export const deleteSection = (index) => {
	return { type: DELETE_SECTION, payload: { index } };
};

export const moveSection = (index, offset) => {
	return { type: MOVE_SECTION, payload: { index, offset } };
};

export const saveModel = () => async (dispatch, getState) => {
	// copy the model over to the event object
	await dispatch(localSaveModel());

	const model = getState().model.sections;

	console.log(model);

	// save the new model
	const res = await api.put("/api/model", { model });

	if (res.status === 200) {
		toast.success("Page successfully saved");
	} else {
		toast.error("Error when saving: " + res.statusText);
	}
};

export const localSaveModel = () => (dispatch, getState) => {
	const currentPage = getState().settings.nowEditingPage;
	const currentModel = getState().model.sections;

	switch (currentPage) {
		case "registration":
			dispatch({ type: SAVE_REG_MODEL, payload: currentModel });
			dispatch({ type: MODEL_ISSAVED });
			break;
		case "event":
			dispatch({ type: SAVE_EVENT_MODEL, payload: currentModel });
			dispatch({ type: MODEL_ISSAVED });
			break;
	}
};
