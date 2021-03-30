import api from "../api/server";
import { toast } from "react-toastify";

export const fetchChatRooms = (event) => async (dispatch) => {
  const chatRooms = await api.get("/api/chatroom/all", {
    params: { event },
  });
  return chatRooms;
};

export const fetchDefaultChatRoom = (event) => async (dispatch) => {
  const chatRoom = await api.get("/api/chatroom/default", {
    params: { event },
  });

  return chatRoom.data;
};

export const addChatRoom = (room, event) => async (dispatch) => {
  const response = await api.post("/api/chatroom", {
    room,
    event,
  });

  return response;
};

export const updateChatRoom = (room) => async (dispatch) => {
  const response = await api.put("/api/chatroom", {
    room,
  });

  return response;
};

export const updateChatModerator = (user) => async (dispatch) => {
  const response = await api.put("/api/chatroom/chat-moderator", {
    user,
  });

  return response;
};

export const getChatModerator = (AccountId, ChatRoomId) => async (dispatch) => {
  const response = await api.get("/api/chatroom/chat-moderator", {
    params: {
      AccountId,
      ChatRoomId,
    },
  });

  return response.data;
};

export const deleteChatRoom = (id) => async (dispatch) => {
  try {
    const response = await api.delete("/api/chatroom", {
      params: { id },
    });

    return response;
  } catch (err) {
    toast.error(err.response.data.message);
  }
};

export const updateChatUserName = (AccountId, ChatRoomId, name) => async (
  dispatch
) => {
  const response = await api.put("/api/chatuser", {
    AccountId,
    name,
    ChatRoomId,
  });

  return response;
};

export const fetchChatUser = (AccountId, ChatRoomId) => async (dispatch) => {
  const response = await api.get("/api/chatuser", {
    params: { AccountId, ChatRoomId },
  });

  return response.data;
};
