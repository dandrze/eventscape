import api from "../api/server";
import { FETCH_ATTENDEE, FETCH_EVENT } from "../actions/types";
import { pageNames } from "../model/enums";
import { fetchModel } from "./modelActions";

export const fetchLivePage = (link, hash) => async (dispatch) => {
  const res = await api.get("/api/event/link", { params: { link } });

  const event = res.data;

  if (event) {
    await dispatch({ type: FETCH_EVENT, payload: event });

    var modelId, pageType;

    if (event.registrationRequired && !hash) {
      modelId = event.RegPageModelId;
      pageType = pageNames.REGISTRATION;
    } else {
      modelId = event.EventPageModelId;
      pageType = pageNames.EVENT;
    }

    dispatch(fetchModel(modelId));
  }

  return { event, pageType };
};

export const fetchAttendeeData = (hash, EventId) => async (dispatch) => {
  const res = await api.get("/api/attendee/hash", {
    params: { hash, EventId },
  });

  const { registration, activeDevices } = res.data;

  await dispatch({
    type: FETCH_ATTENDEE,
    payload: registration,
  });

  return { registration, activeDevices };
};
