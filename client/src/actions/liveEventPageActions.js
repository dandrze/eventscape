import api from "../api/server";
import { FETCH_EVENT, FETCH_PAGE_MODEL } from "../actions/types";

export const fetchLivePage = (link, hash) => async (dispatch) => {
  const event = await api.get("/api/event/link", { params: { link } });

  if (event.data) {
  }

  await dispatch({ type: FETCH_EVENT, payload: event.data });

  const modelId =
    event.data.registration && !hash
      ? // if there is no attendee and the registration is on, pull the registration page
        event.data.reg_page_model
      : // otherwise pull the event page
        event.data.event_page_model;

  const model = await api.get("/api/model/id", { params: { id: modelId } });

  await dispatch({
    type: FETCH_PAGE_MODEL,
    payload: { id: null, sections: model.data },
  });

  return true;
};

export const fetchAttendeeData = (hash) => async (dispatch) => {
  const attendee = await api.get("/api/attendee/hash", { params: { hash } });

  return attendee.data;
};
