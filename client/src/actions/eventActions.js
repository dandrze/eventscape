import { toast } from "react-toastify";
import api from "../api/server";
import {
  logoHeaderModel,
  logoHeaderRightModel,
  heroBannerModel,
  registrationFormDescription,
  titleTimeModel,
  streamChatReact,
  blankModel,
  registrationFormReact,
} from "../components/designBlockModels";
import {
  FETCH_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  LOAD_STARTED,
  LOAD_FINISHED,
} from "./types";
import {
  fetchModelFromId,
  fetchModelFromState,
  saveModel,
} from "./modelActions";
import { model } from "mongoose";

export const createEvent = (
  title,
  link,
  category,
  start_date,
  end_date,
  time_zone,
  primary_color
) => async (dispatch) => {
  const reg_page_model = [
    { html: logoHeaderModel(), name: "banner" },
    {
      html: heroBannerModel(title),
      name: "heroBanner",
    },
    {
      html: registrationFormDescription(),
      name: "registration",
      is_react: true,
      react_component: registrationFormReact,
    },
  ];

  const event_page_model = [
    {
      html: logoHeaderRightModel(),
      name: "bannerRight",
    },
    {
      html: titleTimeModel(title, start_date, end_date),
      name: "titleTime",
    },
    {
      html: null,
      name: "streamChat",
      is_react: true,
      react_component: streamChatReact,
    },
    {
      html: blankModel(),
      name: "blankModel",
    },
  ];

  const event = {
    title,
    link,
    category,
    start_date,
    end_date,
    time_zone,
    primary_color,
    reg_page_model,
    event_page_model,
    status: 0,
  };

  const res = await api.post("/api/event", event);

  if (res.status === 200) {
    await dispatch({
      type: CREATE_EVENT,
      payload: res.data,
    });

    await dispatch(fetchModelFromState());
  } else {
    toast.error("Error when saving: " + res.statusText);
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
  } else {
    toast.error("Error when saving: " + res.statusText);
  }
};

export const fetchEvent = () => async (dispatch) => {
  // call the api and return the event in json
  try {
    dispatch({ type: LOAD_STARTED });
    const event = await api.get("/api/event/current");
    dispatch({ type: LOAD_FINISHED });
    if (event) {
      dispatch({ type: FETCH_EVENT, payload: event.data });
      dispatch(fetchModelFromState());
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
  dispatch({ type: LOAD_STARTED });
  const event = await api.get("/api/event/id", { params: { id } });
  dispatch({ type: LOAD_FINISHED });

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

  const newEvent = { ...getState().event, status: 1 };

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
    console.log(res);
    toast.success("Registration successfuly changed");
    return true;
  } catch (err) {
    toast.error("Error when setting Registration: " + err.toString());
    return false;
  }
};
