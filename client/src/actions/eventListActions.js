import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT_LIST } from "./types";
import { statusOptions } from "../model/enums";

export const fetchEventList = () => async (dispatch) => {
  // call the api and return the event in json
  try {
    const eventList = await api.get("/api/event/all");

    // if there are events
    if (eventList) {
      dispatch({ type: FETCH_EVENT_LIST, payload: eventList.data });
    }

    return true;
  } catch (err) {
    toast.error("Error fetching event list: " + err.toString());
    return false;
  }
};

export const duplicateEvent = (id, link) => async (dispatch) => {
  try {
    const res1 = await api.get("/api/event/id", { params: { id } });
    const newEvent = {
      ...res1.data,
      link: link,
      title: res1.data.title + " copy",
    };
    const res2 = await api.post("/api/event", newEvent);
    toast.success("Event successfully duplicated");
    return true;
  } catch (err) {
    toast.error("Error duplicating event: " + err.toString());
    return false;
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    const res = await api.put("/api/event/id/status", {
      id,
      status: statusOptions.DELETED,
    });
    toast.success("Event successfully deleted");
    return true;
  } catch (err) {
    toast.error("Error deleting event: " + err.toString());
    return false;
  }
};

export const setCurrentEvent = (id) => async (dispatch) => {
  const res = await api.put("/api/event/id/make-current", { id });

  return true;
};

export const restoreEvent = (id) => async (dispatch) => {
  const res = await api.put("/api/event/id/status", {
    id,
    status: statusOptions.DRAFT,
  });

  toast.success("Event successfully restored");
  return true;
};
