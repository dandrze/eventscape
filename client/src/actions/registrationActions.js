import { toast } from "react-toastify";
import api from "../api/server";
import { FETCH_REGISTRATION, LOAD_STARTED, LOAD_FINISHED } from "./types";

export const fetchRegistrations = (event) => async (dispatch) => {
	// call the api and return the registrations in json

	dispatch({ type: LOAD_STARTED });
	const res = await api.get("/api/registration", { params: { event } });
	console.log(res)
	dispatch({ type: LOAD_FINISHED });

	dispatch({ type: FETCH_REGISTRATION, payload: res.data });
	
};