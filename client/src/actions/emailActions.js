import StateContext from "react-scroll-to-bottom/lib/ScrollToBottom/StateContext";
import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_COMMUNICATION_LIST, FETCH_EMAIL_LIST } from "./types";

export const fetchCommunicationList = (EventId) => async (
  dispatch,
  getState
) => {
  // call the api and return the event in json
  try {
    const res = await api.get("/api/communication/all", {
      params: { EventId },
    });

    dispatch({ type: FETCH_COMMUNICATION_LIST, payload: res.data });

    return true;
  } catch (err) {
    toast.error(`Error when fetching emails: ` + err.toString());
    return false;
  }
};

export const fetchEmailList = (emailId) => async (dispatch, getState) => {
  // call the api and return the event in json
  try {
    const res = await api.get("/api/communication-list", {
      params: { emailId },
    });

    return res.data;
  } catch (err) {
    toast.error(`Error when fetching email list: ` + err.toString());
    return false;
  }
};

export const addToEmailList = (data, emailId) => async (dispatch, getState) => {
  // call the api and return the event in json
  try {
    const res = await api.post("/api/communication-list", { data, emailId });

    toast.success("Successfully added recipients");
  } catch (err) {
    toast.error(`Error when fetching email list: ` + err.toString());
    return false;
  }
};

export const deleteFromEmailList = (id) => async (dispatch, getState) => {
  // call the api and return the event in json
  try {
    const res = await api.delete("/api/communication-list", { params: { id } });

    toast.success("Successfully deleted recipient");
  } catch (err) {
    toast.error(`Error when fetching email list: ` + err.toString());
    return false;
  }
};

export const updateFromEmailList = (data, id) => async (dispatch, getState) => {
  // call the api and return the event in json
  try {
    const res = await api.put("/api/communication-list", { data, id });

    toast.success("Successfully deleted recipient");
  } catch (err) {
    toast.error(`Error when fetching email list: ` + err.toString());
    return false;
  }
};

export const addEmail = (email) => async (dispatch, getState) => {
  const EventId = getState().event.id;

  try {
    const res = await api.post("/api/communication", { email, EventId });
    toast.success("Successfully added email");
  } catch (err) {
    toast.error(
      `Error when adding new email. Error: ` + err.response.data.messaage
    );
    return false;
  }
};

export const deleteEmail = (id) => async (dispatch) => {
  try {
    const res = await api.delete("/api/communication/", {
      params: { id },
    });
    toast.success("Successfully deleted email");
    return true;
  } catch (err) {
    toast.error(
      `Error when deleting email. Error: ` + err.response.data.messaage
    );
    return false;
  }
};

export const editEmail = (id, email) => async (dispatch, getState) => {
  try {
    const res = await api.put("/api/communication", { id, email });
    toast.success("Successfully updated email");
    return true;
  } catch (err) {
    toast.error(
      `Error when updating email. Error: ` + err.response.data.messaage
    );
    return false;
  }
};

export const sendTestEmail = (EventId, email) => async (dispatch, getState) => {
  try {
    const res = await api.post("/api/communication/test", { EventId, email });
    toast.success("Successfully sent test email to " + email.emailAddress);
    return true;
  } catch (err) {
    toast.error(
      `Error when sending email. Error: ` + err.response.data.messaage
    );
    return false;
  }
};
