import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_POLLS, SELECT_POLL_BY_INDEX, FETCH_RESULTS } from "./types";

export const fetchPolls = (eventId) => async (dispatch) => {
  // call the api and return the polls in json

  try {
    const res = await api.get("/api/polling/poll/all", { params: { eventId } });

    console.log(res.data);
    dispatch({ type: FETCH_POLLS, payload: res.data });
    return true;
  } catch (err) {
    toast.error("Error when fetching polls: " + err.toString());
    return false;
  }
};

export const selectPollByIndex = (index) => {
  return { type: SELECT_POLL_BY_INDEX, payload: index };
};

export const fetchPollResults = () => async (dispatch, getState) => {
  // call the api and return the polls in json

  const { polls, selectedPollIndex } = getState().polling;

  try {
    const resultsRes = await api.get("/api/polling/results", {
      params: { pollId: polls[selectedPollIndex].id },
    });

    const { results, totalResponded } = resultsRes.data;

    dispatch({ type: FETCH_RESULTS, payload: { results, totalResponded } });

    return true;
  } catch (err) {
    toast.error("Error when fetching polls: " + err.toString());
    return false;
  }
};

export const fetchPollResultsFromId =
  (pollId) => async (dispatch, getState) => {
    // call the api and return the polls in json

    try {
      const resultsRes = await api.get("/api/polling/results", {
        params: { pollId },
      });

      const { results, totalResponded } = resultsRes.data;

      dispatch({ type: FETCH_RESULTS, payload: { results, totalResponded } });

      return true;
    } catch (err) {
      toast.error("Error when fetching polls: " + err.toString());
      return false;
    }
  };
