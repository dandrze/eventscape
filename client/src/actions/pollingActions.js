import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_POLLS } from "./types";

export const fetchPolls = (eventId) => async (dispatch) => {
  // call the api and return the polls in json

  try {
    const res = await api.get("/api/polling/poll/all", { params: { eventId } });
    dispatch({ type: FETCH_POLLS, payload: res.data });
    return true;
  } catch (err) {
    toast.error("Error when fetching polls: " + err.toString());
    return false;
  }
};
