import StateContext from "react-scroll-to-bottom/lib/ScrollToBottom/StateContext";
import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_EMAIL_LIST } from "./types";

export const fetchEmailList = (event) => async (dispatch, getState) => {
  // call the api and return the event in json
  try {
    const res = await api.get("/api/email/all", { params: { event } });

    dispatch({ type: FETCH_EMAIL_LIST, payload: res.data });

    return true;
  } catch (err) {
    toast.error(`Error when fetching emails: ` + err.toString());
    return false;
  }
};

export const addEmail = (email) => async (dispatch, getState) => {
  const event = getState().event.id;

  console.log(email);

  try {
    const res = await api.post("/api/email", { email, event });
    toast.success("Successfully added email");
  } catch (err) {
    toast.error(`Error when adding new email. Error: ` + err.toString());
    return false;
  }
};

export const deleteEmail = (id) => async (dispatch) => {
  try {
    const res = await api.delete("/api/email/", {
      params: { id },
    });
    toast.success("Successfully deleted email");
    return true;
  } catch (err) {
    toast.error(`Error when deleting email. Error: ` + err.toString());
    return false;
  }
};

export const editEmail = (id, email) => async (dispatch, getState) => {
  try {
    const res = await api.put("/api/email", { id, email });
    toast.success("Successfully updated email");
    console.log(res.data);
    return true;
  } catch (err) {
    toast.error(`Error when updating email. Error: ` + err.toString());
    return false;
  }
};
