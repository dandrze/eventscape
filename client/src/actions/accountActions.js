import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_USER } from "./types";

export const signInLocal = (username, password) => async (dispatch) => {
  // response is {user, error}
  try {
    const res = await api.post("/auth/login/local", {
      username,
      password,
    });

    dispatch({ type: FETCH_USER, payload: res.data.user });

    if (res.data.error) {
      toast.error("Error when signing in: " + res.data.error[0]);
      return { error: res.data.error[0] };
    } else {
      return { success: true };
    }
  } catch (err) {
    toast.error("Error when signing in: " + err.response.data.error);
    return { error: err.response.data.error };
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
    const res = await api.get("/api/account/email", {
      params: { emailAddress },
    });

    console.log(res.data);

    console.log(Boolean(res.data));
    // if it's empty, send false, if it exists, send true
    return Boolean(res.data);
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

    console.log(res.data);

    if (res.data) {
      dispatch({ type: FETCH_USER, payload: res.data });
    }
    toast.success("Contact details successfully updated!");

    return res.data;
  } catch (err) {
    toast.error("Error when updating contact details: " + err.toString());
  }
};

export const updatePassword = (userId, oldPassword, newPassword) => async (
  dispatch
) => {
  try {
    const res = await api.put("/auth/change-password", {
      userId,
      oldPassword,
      newPassword,
    });

    console.log(res.data);

    toast.success("Password successfully updated!");

    return true;
  } catch (err) {
    toast.error("Error when updating password: " + err.response.data.error);
    return false;
  }
};

export const requestPasswordReset = (emailAddress) => async (dispatch) => {
  try {
    const res = await api.post("/auth/request-password-reset", {
      emailAddress,
    });

    const emailFound = res.data;

    return emailFound;
  } catch (err) {
    toast.error(
      "Error when requesting password reset: " + err.response.data.error
    );
    return false;
  }
};
