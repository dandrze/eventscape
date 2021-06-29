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
  "https://eventscape-assets.s3.amazonaws.com/free-images/abstract-1963884_1920.jpg";
const defaultBackgroundColor = "rgba(30, 30, 31, 0.384)";
const defaultBlur = 5;
const maxDevicesEnabledDefault = true;
const maxDevicesDefault = 1;

export const finalizeEvent =
  (
    eventId,
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
  ) =>
  async (dispatch) => {
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
      maxDevicesEnabled: maxDevicesEnabledDefault,
      maxDevices: maxDevicesDefault,
    };

    try {
      const res = await api.post("/api/event/finalize", {
        eventId,
        event,
        communications: emaillistTemplate(startDate),
      });

      await dispatch(fetchEvent());
      return true;
    } catch (err) {
      toast.error(
        "Error when creating new event: " + err.response.data.message
      );
      return false;
    }
  };

export const createEvent = (title) => async (dispatch) => {
  try {
    const res = await api.post("/api/event", { title });

    return res.data.id;
  } catch (err) {
    toast.error("Error when creating new event: " + err.response.data.message);
    return false;
  }
};

export const updateEvent = (event) => async (dispatch, getState) => {
  try {
    const res = await api.put("/api/event", event);

    await dispatch(fetchEvent());
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

export const isLinkAvailable = (link) => async (dispatch) => {
  const res = await api.get("/api/event/link", { params: { link } });

  if (res.data) {
    return false;
  } else {
    return true;
  }
};
