import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_REGISTRATION, LOAD_STARTED, LOAD_FINISHED } from "./types";

export const fetchRegistrations = (event) => async (dispatch) => {
  // call the api and return the registrations in json

  dispatch({ type: LOAD_STARTED });
  try {
    const res = await api.get("/api/registration", { params: { event } });
    dispatch({ type: LOAD_FINISHED });
    dispatch({ type: FETCH_REGISTRATION, payload: res.data });
    return true;
  } catch (err) {
    toast.error("Error when fetching registrations: " + err.toString());
    return false;
  }
};

export const addRegistration = (
  firstName,
  lastName,
  email,
  event,
  organization
) => async (dispatch) => {
  try {
    const res = await api.post("/api/registration", {
      firstName,
      lastName,
      email,
      event,
      organization,
    });
    toast.success("Registration successfuly added");
    return true;
  } catch (err) {
    toast.error("Error when adding registration: " + err.toString());
    return false;
  }
};

export const updateRegistration = (
  firstName,
  lastName,
  email,
  event,
  organization,
  id
) => async (dispatch) => {
  try {
    const res = await api.put("/api/registration", {
      firstName,
      lastName,
      email,
      event,
      organization,
      id,
    });
    toast.success("Registration successfuly modified");
    return true;
  } catch (err) {
    toast.error("Error when modifying registration: " + err.toString());
    return false;
  }
};

export const deleteRegistration = (id) => async (dispatch) => {
  try {
    const res = await api.delete("/api/registration/id", { params: { id } });
    toast.success("Registration successfuly deleted");
    return true;
  } catch (err) {
    toast.error("Error when deleting registration: " + err.toString());
    return false;
  }
};
