import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_REGISTRATION, LOAD_STARTED, LOAD_FINISHED } from "./types";

export const fetchRegistrations = (event) => async (dispatch) => {
  // call the api and return the registrations in json

  dispatch({ type: LOAD_STARTED });
  const res = await api.get("/api/registration", { params: { event } });
  console.log(res);
  dispatch({ type: LOAD_FINISHED });

  dispatch({ type: FETCH_REGISTRATION, payload: res.data });
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
    toast.error("Error when adding Registration: " + err.toString());
    return false;
  }
};
