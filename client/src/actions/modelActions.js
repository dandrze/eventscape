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
  FLAG_UPDATE,
  SIMULATE_HOVER,
  UPDATE_BACKGROUND_COLOR,
  UPDATE_BACKGROUND_IMAGE,
  UPDATE_BACKGROUND_BLUR,
} from "./types";
import { pageNames } from "../model/enums";

export const fetchModel = (id) => async (dispatch) => {
  const model = await api.get("/api/model/id", { params: { id } });
  const { sections, backgroundColor, backgroundImage, backgroundBlur } = model.data;

  await dispatch({
    type: FETCH_PAGE_MODEL,
    payload: { id, sections, backgroundColor, backgroundImage, backgroundBlur },
  });

  return true;
};

export const updateSection = (index, html) => {
  const payload = {
    index,
    html,
  };
  return { type: UPDATE_SECTION, payload };
};

export const flagSectionUpdated = () => {
  return { type: FLAG_UPDATE };
};

export const addSection = (
  prevIndex,
  html,
  isReact = false,
  reactComponent = null
) => async (dispatch, getState) => {
  const PageModelId = getState().model.id;

  if (reactComponent && reactComponent.name === "StreamChat") {
    const chatRoom = await api.get("/api/chatroom/default", {
      params: { event: getState().event.id },
    });
    reactComponent.props.chatRoom = chatRoom.data.id;
  }

  const payload = {
    index: prevIndex + 1,
    model: {
      PageModelId,
      html,
      isReact,
      reactComponent,
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

export const saveModel = (page) => async (dispatch, getState) => {
  // copy the model over to the event object
  await dispatch(localSaveModel(page));

  const model = getState().model;

  // save the new model
  try {
    const res = await api.put("/api/model", { model });

    toast.success("Page successfully saved");
    return res.data;
  } catch (err) {
    toast.error("Error when updating event: " + err.response.data.message);
    return false;
  }
};

export const localSaveModel = (page) => (dispatch, getState) => {
  const currentModel = getState().model.sections;

  switch (page) {
    case pageNames.REGISTRATION:
      dispatch({ type: SAVE_REG_MODEL, payload: currentModel });
      dispatch({ type: MODEL_ISSAVED });
      break;
    case pageNames.EVENT:
      dispatch({ type: SAVE_EVENT_MODEL, payload: currentModel });
      dispatch({ type: MODEL_ISSAVED });
      break;
    default:
      break;
  }
};

export const saveStreamSettings = (index, updatedProps) => async (
  dispatch,
  getState
) => {
  const reactComponent = getState().model.sections[index].reactComponent;

  reactComponent.props = updatedProps;

  dispatch({
    type: UPDATE_REACT_COMPONENT,
    payload: { index, reactComponent: reactComponent },
  });
};

export const simulateHover = (index) => async (dispatch) => {
  dispatch({ type: SIMULATE_HOVER, payload: index });
};

export const updateBackgroundImage = (image) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_BACKGROUND_IMAGE, payload: image });
};

export const updateBackgroundColor = (color) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_BACKGROUND_COLOR, payload: color });
};

export const updateBackgroundBlur = (blurValue) => async (
  dispatch,
  getState
) => {
  dispatch({ type: UPDATE_BACKGROUND_BLUR, payload: blurValue });
};
