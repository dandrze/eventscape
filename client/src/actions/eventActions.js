import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT, CREATE_EVENT, UPDATE_EVENT } from "./types";
import { saveModel } from "./modelActions";
import {
  regPageModelTemplate,
  eventPageModelTemplate,
  emaillistTemplate,
} from "../templates/newEventTemplates";
import { statusOptions } from "../model/enums";

export const createEvent = (
  title,
  link,
  category,
  startDate,
  endDate,
  timeZone,
  primaryColor
) => async (dispatch) => {
  const event = {
    title,
    link,
    category,
    startDate,
    endDate,
    timeZone,
    primaryColor,
    regPageModel: regPageModelTemplate(title),
    eventPageModel: eventPageModelTemplate(title, startDate, endDate),
  };

  try {
    const res = await api.post("/api/event", {
      event,
      communications: emaillistTemplate(startDate),
    });

    await dispatch({
      type: CREATE_EVENT,
      payload: res.data,
    });
    return true;
  } catch (err) {
    console.log(err.response);
    toast.error("Error when creating new event: " + err.response.data.error);
    return false;
  }
};

export const updateEvent = (
  title,
  link,
  category,
  startDate,
  endDate,
  timeZone,
  primaryColor
) => async (dispatch, getState) => {
  const updatedEvent = {
    title,
    link,
    category,
    startDate,
    endDate,
    timeZone,
    primaryColor,
    status: getState().event.status,
  };

  try {
    const res = await api.put("/api/event", updatedEvent);

    await dispatch({
      type: UPDATE_EVENT,
      payload: res.data,
    });
    toast.success("Event successfully saved.");
    return true;
  } catch (err) {
    console.log(err.response);
    toast.error("Error when updating event: " + err.response.data.error);
    return false;
  }
};

export const fetchEvent = () => async (dispatch) => {
  // call the api and return the event in json
  try {
    const event = await api.get("/api/event/current");
    if (event) {
      dispatch({ type: FETCH_EVENT, payload: event.data });
      return event;
    } else {
      console.log("no events");
      return null;
    }
  } catch (err) {
    toast.error("Error when fetching events: " + err.response.data.error);
    return false;
  }
};

export const fetchEventFromId = (id) => async (dispatch) => {
  // call the api and return the event in json
  const event = await api.get("/api/event/id", { params: { id } });

  if (event) {
    dispatch({ type: FETCH_EVENT, payload: event.data });
    return event;
  } else {
    console.log("no events");
    return null;
  }
};

export const publishPage = () => async (dispatch, getState) => {
  // save the model
  await dispatch(saveModel());

  const newEvent = { ...getState().event, status: statusOptions.ACTIVE };
  console.log(newEvent);

  try {
    console.log(newEvent);
    const res = await api.put("/api/event", newEvent);

    await dispatch({
      type: UPDATE_EVENT,
      payload: res.data,
    });
    toast.success("Page successfully published");
  } catch (err) {
    toast.error("Error when saving: " + err.response.data.error);
  }
};

export const isLinkAvailable = (link) => async (dispatch) => {
  const res = await api.get("/api/event/link", { params: { link } });

  if (res.data.length === 0) {
    return true;
  } else {
    return false;
  }
};

export const setEventRegistration = (hasRegistration, EventId) => async (
  dispatch
) => {
  try {
    const res = await api.put("/api/event/set-registration", {
      hasRegistration,
      EventId,
    });
    toast.success("Registration successfuly changed");
    return true;
  } catch (err) {
    toast.error("Error when setting Registration: " + err.response.data.error);
    return false;
  }
};
