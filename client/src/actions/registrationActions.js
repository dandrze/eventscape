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

  try {
    const res = await api.get("/api/registration/event", { params: { event } });
    dispatch({ type: FETCH_REGISTRATION, payload: res.data });
    return true;
  } catch (err) {
    toast.error("Error when fetching registrations: " + err.toString());
    return false;
  }
};

export const fetchRegistrationForm = (event) => async (dispatch) => {
  // call the api and return the registrations in json

  try {
    const res = await api.get("/api/form", { params: { event } });
    if (res.status == 200) {
      dispatch({ type: FETCH_FORM, payload: res.data });
    }

    return true;
  } catch (err) {
    toast.error(
      "Error when fetching registration form columns: " + err.toString()
    );
    return false;
  }
};

export const addRegistration = (
  EventId,
  values,
  emailAddress,
  firstName,
  lastName
) => async (dispatch) => {
  try {
    const res = await api.post("/api/registration", {
      EventId,
      values,
      emailAddress,
      firstName,
      lastName,
    });
    return true;
  } catch (err) {
    toast.error("Error when adding registration: " + err.response.data.message);
    return false;
  }
};

export const updateRegistration = (
  id,
  values,
  emailAddress,
  firstName,
  lastName
) => async (dispatch) => {
  try {
    const res = await api.put("/api/registration", {
      id,
      values,
      emailAddress,
      firstName,
      lastName,
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

export const fetchRegistration = (emailAddress, EventId) => async (
  dispatch
) => {
  try {
    const res = await api.get("/api/registration/email", {
      params: { emailAddress, EventId },
    });
    return res.data;
  } catch (err) {
    toast.error(
      "Server error when finding your registration. Please refresh and try again: " +
        err.toString()
    );
    return false;
  }
};

export const resendRegistrationEmail = (emailAddress, EventId) => async (
  dispatch
) => {
  try {
    const res = await api.post("/api/registration/email/resend", {
      emailAddress,
      EventId,
    });
    return true;
  } catch (err) {
    toast.error(
      "Server error when resending your link. Please refresh and try again: " +
        err.toString()
    );
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
