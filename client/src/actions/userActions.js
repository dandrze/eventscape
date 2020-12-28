import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_USER } from "../actions/types";

export const signInLocal = (username, password) => async (dispatch) => {
  // response is {user, error}
  const res = await api.post("/auth/login/local", {
    username,
    password,
  });

  dispatch({ type: FETCH_USER, payload: res.data.user });

  if (res.data.error) {
    toast.error("Error when signing in: " + res.data.error[0]);
    return false;
  } else {
    return res.data.user;
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
    const res = await api.put("/api/account/pw", {
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
