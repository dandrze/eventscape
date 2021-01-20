import api from "../api/server";
import { toast } from "react-toastify";

export const fetchCurrentVisitors = (EventId) => async (dispatch) => {
  const visitorData = await api.get("/api/analytics/visitor-data", {
    params: { EventId },
  });

  console.log(visitorData.data);
  return visitorData.data;
};
