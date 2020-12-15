import StateContext from "react-scroll-to-bottom/lib/ScrollToBottom/StateContext";
import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EMAIL_LIST, LOAD_STARTED, LOAD_FINISHED } from "./types";

export const fetchEmailList = (event) => async (dispatch, getState) => {
  // call the api and return the event in json

  dispatch({ type: LOAD_STARTED });
  const res = await api.get("/api/email/all", { params: { event } });
  dispatch({ type: LOAD_FINISHED });

  dispatch({ type: FETCH_EMAIL_LIST, payload: res.data });
};
