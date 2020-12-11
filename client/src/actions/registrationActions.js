import { toast } from "react-toastify";
import api from "../api/server";
import {
  FETCH_REGISTRATION,
  LOAD_STARTED,
  LOAD_FINISHED,
  FETCH_FORM,
} from "./types";

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

export const fetchRegistrationForm = (event) => async (dispatch) => {
  // call the api and return the registrations in json

  dispatch({ type: LOAD_STARTED });
  try {
    const res = await api.get("/api/form", { params: { event } });
    if (res.status == 200) {
      dispatch({ type: FETCH_FORM, payload: res.data });
    }
    dispatch({ type: LOAD_FINISHED });

    return true;
  } catch (err) {
    toast.error(
      "Error when fetching registration form columns: " + err.toString()
    );
    return false;
  }
};

export const addRegistration = (event, values) => async (dispatch) => {
  try {
    const res = await api.post("/api/registration", {
      event,
      values,
    });
    return true;
  } catch (err) {
    toast.error("Error when adding registration: " + err.toString());
    return false;
  }
};

export const updateRegistration = (id, values) => async (dispatch) => {
  try {
    const res = await api.put("/api/registration", {
      id,
      values: JSON.stringify(values),
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

const mapMaterialToFormBuilder = (values) => {
  var mappedValues = [];
  for (var key in values) {
    mappedValues.push({ name: key, value: values[key] });
  }

  return mappedValues;
};
