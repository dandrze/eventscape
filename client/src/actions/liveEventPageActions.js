import api from "../api/server";
import { FETCH_ATTENDEE, FETCH_EVENT } from "../actions/types";
import { pageNames } from "../model/enums";
import { fetchModel } from "./modelActions";

export const fetchLivePage = (link, hash) => async (dispatch) => {
  const event = await api.get("/api/event/link", { params: { link } });

  if (event.data) {
    await dispatch({ type: FETCH_EVENT, payload: event.data });

    var modelId, pageType;

    if (event.data.registrationRequired && !hash) {
      modelId = event.data.RegPageModelId;
      pageType = pageNames.REGISTRATION;
    } else {
      modelId = event.data.EventPageModelId;
      pageType = pageNames.EVENT;
    }

    dispatch(fetchModel(modelId));
  }

  return { event: event.data, pageType };
};

export const fetchAttendeeData = (hash, EventId) => async (dispatch) => {
  const attendee = await api.get("/api/attendee/hash", {
    params: { hash, EventId },
  });

  await dispatch({
    type: FETCH_ATTENDEE,
    payload: attendee.data,
  });

  return attendee.data;
};
