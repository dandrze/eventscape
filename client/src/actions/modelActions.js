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
  const payload = {
    index,
    html,
  };
  return { type: UPDATE_SECTION, payload };
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

  const model = getState().model.sections;

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
