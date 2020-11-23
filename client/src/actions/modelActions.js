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
	LOAD_STARTED,
	LOAD_FINISHED,
	UPDATE_REACT_COMPONENT,
} from "./types";

const fillModel = (model) => {
	console.log(model);
	const completeSections = model.map((section) => {
		return { ...section, html: section.html.replace(/Kevin/g, "Bob") };
	});

	return completeSections;
};

export const fetchPublishedPage = (pageLink) => async (dispatch) => {
	const model = await api.get("/api/page", { params: { link: pageLink } });

	dispatch({
		type: FETCH_PAGE_MODEL,
		payload: { id: model.data[0].id, sections: model.data },
	});
};

export const fetchModelFromState = () => async (dispatch, getState) => {
	var id;
	try {
		switch (getState().settings.nowEditingPage) {
			case "registration":
				id = getState().event.reg_page_model;
				break;
			case "event":
				id = getState().event.event_page_model;
				break;
		}

		const model = await api.get("/api/model/id", { params: { id } });

		dispatch({ type: FETCH_PAGE_MODEL, payload: { id, sections: model.data } });
	} catch {
		console.log("event is empty");
	}
};

export const fetchModelFromId = (id) => async (dispatch) => {
	const emptyModel = await api.get("/api/model/id", { params: { id } });

	const filledModel = fillModel(emptyModel.data);

	console.log(filledModel);

	dispatch({ type: FETCH_PAGE_MODEL, payload: { id, sections: filledModel } });
};

export const updateSection = (index, html) => {
	// call the api and return the event in json
	const payload = {
		index,
		html,
	};
	return { type: UPDATE_SECTION, payload };
};

export const addSection = (
	prevIndex,
	html,
	is_react = false,
	react_component = null,
	is_stream = false
) => async (dispatch, getState) => {
	const model = getState().model.id;

	const payload = {
		index: prevIndex + 1,
		model: {
			model,
			html,
			is_react,
			react_component,
			is_stream,
		},
	};

	console.log(payload);

	dispatch({ type: ADD_SECTION, payload });
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

export const fetchLivePage = (link) => async (dispatch) => {
	dispatch({ type: LOAD_STARTED });
	const event = await api.get("/api/event/link", { params: { link } });
	dispatch({ type: LOAD_FINISHED });

	if (event.data.status === 1) {
		// if the event status is 1, it's live so fetch the live event page model
		dispatch(fetchModelFromId(event.data.event_page_model));
	} else if (event.data.status === 0) {
		// if the status is 0, it's a draft so fetch the registration page model
		dispatch(fetchModelFromId(event.data.reg_page_model));
	} else {
		dispatch(fetchModelFromId(null));
	}
};

export const saveStreamSettings = (index, settings) => async (
	dispatch,
	getState
) => {
	const reactComponent = getState().model.sections[index].react_component;
	reactComponent.props.link = settings.link;

	dispatch({
		type: UPDATE_REACT_COMPONENT,
		payload: { index, react_component: reactComponent },
	});
};
