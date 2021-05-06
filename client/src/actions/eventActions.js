import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT, UPDATE_EVENT } from "./types";
import { saveModel } from "./modelActions";
import {
  regPageModelTemplate,
  eventPageModelTemplate,
  emaillistTemplate,
} from "../templates/newEventTemplates";
import { statusOptions } from "../model/enums";

const defaultBackgroundImage =
  "https://eventscape-assets.s3.amazonaws.com/free-images/abstract-5719523_1920.jpg";
const defaultBackgroundColor = "rgba(0,0,0,0)";
const defaultBlur = 5;

export const createEvent = (
  title,
  link,
  category,
  startDate,
  endDate,
  timeZone,
  primaryColor,
  registrationRequired,
  description,
  logo,
  backgroundImage = defaultBackgroundImage,
  backgroundColor = defaultBackgroundColor
) => async (dispatch) => {
  const event = {
    title,
    link,
    category,
    startDate,
    endDate,
    timeZone,
    primaryColor,
    registrationRequired,
    regPageModel: regPageModelTemplate({
      title,
      startDate,
      endDate,
      timeZone,
      description,
      logo,
    }),
    eventPageModel: eventPageModelTemplate({
      title,
      logo,
    }),
    description,
    backgroundImage,
    backgroundColor,
    backgroundBlur: defaultBlur,
  };

  console.log(event);

  try {
    const res = await api.post("/api/event", {
      event,
      communications: emaillistTemplate(startDate),
    });

    await dispatch(fetchEvent());
    return true;
  } catch (err) {
    toast.error("Error when creating new event: " + err.response.data.message);
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
  primaryColor,
  registrationRequired
) => async (dispatch, getState) => {
  const updatedEvent = {
    title,
    link,
    category,
    startDate,
    endDate,
    timeZone,
    primaryColor,
    registrationRequired,
    status: getState().event.status,
  };

  try {
    const res = await api.put("/api/event", updatedEvent);

    await dispatch(fetchEvent());
    toast.success("Event successfully saved.");
    return true;
  } catch (err) {
    toast.error("Error when updating event: " + err.response.data.message);
    return false;
  }
};

export const fetchEvent = () => async (dispatch, getState) => {
  // call the api and return the event in json
  try {
    const event = await api.get("/api/event/current");

    // if an event exists, update redux
    if (event.data) {
      const accountId = getState().user.id;

      const currentUserPermissions = event.data.permissions.filter(
        (permission) => permission.AccountId === accountId
      );

      dispatch({
        type: FETCH_EVENT,
        payload: {
          ...event.data,
          permissions: currentUserPermissions[0],
          plan: event.data.plan,
        },
      });
      return event;
    } else {
      // else return an empty event with loaded: true. This is used to determine if the page should display a spinner or event not found
      dispatch({
        type: FETCH_EVENT,
        payload: { loaded: true },
      });
      return null;
    }
  } catch (err) {
    console.log(err);
    toast.error("Error when fetching events: " + err.response.data.message);
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
    return null;
  }
};

export const publishPage = () => async (dispatch, getState) => {
  // save the model
  await dispatch(saveModel());

  const newEvent = { ...getState().event, status: statusOptions.ACTIVE };

  try {
    const res = await api.put("/api/event", newEvent);

    await dispatch(fetchEvent());
    toast.success("Page successfully published");
  } catch (err) {
    toast.error("Error when saving: " + err.response.data.message);
  }
};

export const isLinkAvailable = (link) => async (dispatch) => {
  const res = await api.get("/api/event/link", { params: { link } });

  console.log(res);

  if (res.data) {
    return false;
  } else {
    return true;
  }
};
