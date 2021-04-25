import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_USER } from "./types";
import Cookies from "universal-cookie";

export const signInWithCode = (emailAddress, code) => async (dispatch) => {
  const cookies = new Cookies();

  try {
    const res = await api.post("/auth/login/local", {
      username: emailAddress,
      password: code,
    });

    cookies.set("user", {
      emailAddress: res.data.emailAddress,
      id: res.data.id,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
    });

    dispatch({ type: FETCH_USER, payload: res.data.user });

    if (res.data.error) {
      toast.error("Error when signing in: " + res.data.error[0]);
      return { error: res.data.error[0] };
    } else {
      return { success: true };
    }
  } catch (err) {
    toast.error("Error when signing in: " + err.response.data.message);
    return { error: err.response.data.message };
  }
};

export const fetchUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth/current-user");

    dispatch({ type: FETCH_USER, payload: res.data });

    return res.data;
  } catch (err) {
    toast.error("Error when fetching user profile: " + err.toString());
  }
};

export const createAccount = (userData) => async (dispatch) => {
  try {
    const res = await api.post("/api/account", { userData });

    return res.data;
  } catch (err) {
    toast.error("Error when creating new account: " + err.toString());
  }
};

export const checkEmailExists = (emailAddress) => async (dispatch) => {
  try {
    const res = await api.get("/api/account/email-exists", {
      params: { emailAddress },
    });

    // if it's empty, send false, if it exists, send true
    return res.data;
  } catch (err) {
    toast.error(
      "Server error when checking if email exists: " + err.toString()
    );
  }
};

export const updateAccountContact = (userId, contactData) => async (
  dispatch
) => {
  try {
    const res = await api.put("/api/account", { userId, contactData });

    if (res.data) {
      dispatch({ type: FETCH_USER, payload: res.data });
    }
    toast.success("Contact details successfully updated!");

    return res.data;
  } catch (err) {
    toast.error("Error when updating contact details: " + err.toString());
  }
};

export const setTourCompleted = () => async (dispatch) => {
  const res = await api.post("/api/account/tour-complete");

  dispatch(fetchUser());
};
