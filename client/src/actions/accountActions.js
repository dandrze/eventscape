import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_USER, SET_S3HASH } from "./types";

export const signInLocal = (username, password) => async (dispatch) => {
  // response is {user, error}
  try {
    const res = await api.post("/auth/login/local", {
      username,
      password,
    });

    dispatch({ type: FETCH_USER, payload: res.data.user });

    if (res.data.user) {
      const s3hash = await api.get("/api/froala/get-s3-signature", {
        params: { accountId: res.data.user.id },
      });

      dispatch({ type: SET_S3HASH, payload: s3hash.data });
    }

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
    console.log(res);

    dispatch({ type: FETCH_USER, payload: res.data });

    console.log(res.data);

    if (res.data) {
      const s3hash = await api.get("/api/froala/get-s3-signature", {
        params: { accountId: res.data.id },
      });

      dispatch({ type: SET_S3HASH, payload: s3hash.data });
    }

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
    toast.error("Error when updating password: " + err.response.data.message);
    return false;
  }
};
