import api from "../api/server";
import {
  FETCH_ATTENDEE,
  FETCH_EVENT,
  FETCH_PAGE_MODEL,
} from "../actions/types";
import { pageNames } from "../model/enums";

export const fetchLivePage = (link, hash) => async (dispatch) => {
  const event = await api.get("/api/event/link", { params: { link } });

  if (event.data) {
    await dispatch({ type: FETCH_EVENT, payload: event.data });

    console.log(event.data);
    console.log(hash);

    var modelId, pageType;

    if (event.data.registration && !hash) {
      modelId = event.data.RegPageModelId;
      pageType = pageNames.REGISTRATION;
    } else {
      modelId = event.data.EventPageModelId;
      pageType = pageNames.EVENT;
    }

    const model = await api.get("/api/model/id", { params: { id: modelId } });

    await dispatch({
      type: FETCH_PAGE_MODEL,
      payload: { id: null, sections: model.data },
    });
  }

  return { event: event.data, pageType };
};

export const fetchAttendeeData = (hash, eventId) => async (dispatch) => {
  console.log(eventId);
  const attendee = await api.get("/api/attendee/hash", {
    params: { hash, eventId },
  });

  await dispatch({
    type: FETCH_ATTENDEE,
    payload: attendee.data,
  });

  return attendee.data;
};
