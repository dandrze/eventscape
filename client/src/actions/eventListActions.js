import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EVENT_LIST } from "./types";
import { status as statusEnum } from "../model/enums";

export const fetchEventList = () => async (dispatch) => {
  // call the api and return the event in json

  const eventList = await api.get("/api/event/all");

  // if there are events
  if (eventList) {
    dispatch({ type: FETCH_EVENT_LIST, payload: eventList.data });
  }
};

export const duplicateEvent = (id, link) => async (dispatch) => {
  const res1 = await api.get("/api/event/id", { params: { id } });
  const newEvent = {
    ...res1.data,
    link: link,
    title: res1.data.title + " copy",
  };
  const res2 = await api.post("/api/event", newEvent);
  toast.success("Event successfully duplicated");
  return true;
};

export const deleteEvent = (id) => async (dispatch) => {
  const res = await api.put("/api/event/id/status", {
    params: { id, status: statusEnum.DELETED },
  });
  toast.success("Event successfully deleted");
  return true;
};

export const setCurrentEvent = (id) => async (dispatch) => {
  const res = await api.put("/api/event/id/make-current", { id });

  return true;
};

export const restoreEvent = (id) => async (dispatch) => {
  const res = await api.put("/api/event/id/status", {
    id,
    status: statusEnum.DRAFT,
  });

  toast.success("Event successfully restored");
  return true;
};
