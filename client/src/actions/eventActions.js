import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT, CREATE_EVENT, UPDATE_EVENT } from "./types";
import { saveModel } from "./modelActions";
import {
  regPageModelTemplate,
  eventPageModelTemplate,
  emaillistTemplate,
} from "../templates/newEventTemplates";

export const createEvent = (
  title,
  link,
  category,
  start_date,
  end_date,
  time_zone,
  primary_color
) => async (dispatch) => {
  const event = {
    title,
    link,
    category,
    start_date,
    end_date,
    time_zone,
    primary_color,
    reg_page_model: regPageModelTemplate(title),
    event_page_model: eventPageModelTemplate(title, start_date, end_date),
  };

  const res = await api.post("/api/event", {
    event,
    emails: emaillistTemplate(start_date),
  });

  if (res.status === 200) {
    await dispatch({
      type: CREATE_EVENT,
      payload: res.data,
    });
    toast.success("Event successfully created");
  } else {
    toast.error("Error when creating new event: " + res.statusText);
  }
};

export const updateEvent = (
  title,
  link,
  category,
  start_date,
  end_date,
  time_zone,
  primary_color
) => async (dispatch, getState) => {
  const updatedEvent = {
    title,
    link,
    category,
    start_date,
    end_date,
    time_zone,
    primary_color,
    status: getState().event.status,
  };

  const res = await api.put("/api/event", updatedEvent);

  if (res.status === 200) {
    await dispatch({
      type: UPDATE_EVENT,
      payload: res.data,
    });
    toast.success("Event successfully saved.");
  } else {
    toast.error("Error when saving: " + res.statusText);
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
    toast.error("Error when fetching events: " + err.toString());
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

  const newEvent = { ...getState().event, status: "active" };

  const res = await api.put("/api/event", newEvent);

  if (res.status === 200) {
    await dispatch({
      type: UPDATE_EVENT,
      payload: res.data,
    });
    toast.success("Page successfully published");
  } else {
    toast.error("Error when saving: " + res.statusText);
  }
};

export const isLinkAvailable = (link) => async (dispatch) => {
  const res = await api.get("/api/model/link", { params: { link } });

  if (res.data.length == 0) {
    return true;
  } else {
    return false;
  }
};

export const setEventRegistration = (registrationEnabled, event) => async (
  dispatch
) => {
  try {
    const res = await api.put("/api/event/set-registration", {
      registrationEnabled,
      event,
    });
    toast.success("Registration successfuly changed");
    return true;
  } catch (err) {
    toast.error("Error when setting Registration: " + err.toString());
    return false;
  }
};
