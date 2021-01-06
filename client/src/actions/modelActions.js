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
  UPDATE_REACT_COMPONENT,
  FETCH_EVENT,
} from "./types";
import { pageNames } from "../model/enums";

export const fetchPublishedPage = (pageLink) => async (dispatch) => {
  const model = await api.get("/api/page", { params: { link: pageLink } });

  dispatch({
    type: FETCH_PAGE_MODEL,
    payload: model.data,
  });
};

export const fetchModel = (id) => async (dispatch) => {
  const model = await api.get("/api/model/id", { params: { id } });

  await dispatch({
    type: FETCH_PAGE_MODEL,
    payload: { id, sections: model.data },
  });

  return true;
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
  react_component = null
) => async (dispatch, getState) => {
  const model = getState().model.id;

  if (react_component.name === "StreamChat") {
    const chatRoom = await api.post("/api/event/chatroom/default", {
      event: getState().event.id,
    });
    react_component.props.chatRoom = chatRoom.data.id;
  }

  const payload = {
    index: prevIndex + 1,
    model: {
      model,
      html,
      is_react,
      react_component,
    },
  };

  dispatch({ type: ADD_SECTION, payload });

  //signals to the caller that the process is complete. Needed for async await.
  return true;
};

export const deleteSection = (index, section) => async (dispatch, getState) => {
  dispatch({ type: DELETE_SECTION, payload: { index } });
};

export const moveSection = (index, offset) => {
  return { type: MOVE_SECTION, payload: { index, offset } };
};

export const saveModel = () => async (dispatch, getState) => {
  // copy the model over to the event object
  await dispatch(localSaveModel());

  const model = getState().model.sections;

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
    case pageNames.REGISTRATION:
      dispatch({ type: SAVE_REG_MODEL, payload: currentModel });
      dispatch({ type: MODEL_ISSAVED });
      break;
    case pageNames.EVENT:
      dispatch({ type: SAVE_EVENT_MODEL, payload: currentModel });
      dispatch({ type: MODEL_ISSAVED });
      break;
  }
};

export const saveStreamSettings = (index, updatedProps) => async (
  dispatch,
  getState
) => {
  const reactComponent = getState().model.sections[index].react_component;
  reactComponent.props.content = updatedProps.content;
  reactComponent.props.link = updatedProps.link;
  reactComponent.props.html = updatedProps.html;
  reactComponent.props.chatRoom = updatedProps.chatRoom;

  dispatch({
    type: UPDATE_REACT_COMPONENT,
    payload: { index, react_component: reactComponent },
  });
};

export const saveChatSettings = (index, chatSettings) => async (
  dispatch,
  getState
) => {
  const reactComponent = getState().model.sections[index].react_component;

  reactComponent.props.chatRoom = chatSettings.chatRoom;

  dispatch({
    type: UPDATE_REACT_COMPONENT,
    payload: { index, react_component: reactComponent },
  });
};
