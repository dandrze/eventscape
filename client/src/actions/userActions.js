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
