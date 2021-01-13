import api from "../api/server";
import { toast } from "react-toastify";

export const fetchChatRooms = (event) => async (dispatch) => {
  const chatRooms = await api.get("/api/event/chatroom/all", {
    params: { event },
  });
  return chatRooms;
};

export const fetchDefaultChatRoom = (event) => async (dispatch) => {
  const chatRoom = await api.get("/api/event/chatroom/default", {
    params: { event },
  });

  return chatRoom.data;
};

export const addChatRoom = (room, event) => async (dispatch) => {
  const response = await api.post("/api/event/chatroom", {
    room,
    event,
  });

  console.log(response);

  return response;
};

export const updateChatRoom = (room) => async (dispatch) => {
  const response = await api.put("/api/event/chatroom", {
    room,
  });

  console.log(response);

  return response;
};

export const deleteChatRoom = (id) => async (dispatch) => {
  try {
    const response = await api.delete("/api/event/chatroom", {
      params: { id },
    });

    return response;
  } catch (err) {
    toast.error(err.response.data.message);
  }
};

export const updateChatUserName = (userId, name) => async (dispatch) => {
  console.log(userId);
  const response = await api.put("/api/event/chatuser", {
    userId,
    name,
  });

  console.log(response);

  return response;
};

export const fetchChatUser = (userId) => async (dispatch) => {
  const response = await api.get("/api/event/chatuser", {
    params: { userId },
  });

  console.log(response);

  return response.data;
};
