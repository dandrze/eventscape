import api from "../api/server";
import { toast } from "react-toastify";

export const fetchCurrentVisitors = (eventId) => async (dispatch) => {
  const visitorData = await api.get("/api/analytics/visitor-data", {
    params: { eventId },
  });

  console.log(visitorData.data);
  return visitorData.data;
};
