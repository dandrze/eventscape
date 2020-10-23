import { SIGNIN_USER } from "../actions/types";

export default function (state = null, action) {
	switch (action.type) {
		case SIGNIN_USER:
			console.log("sign in reducer called");
			return action.payload || false;
		default:
			return state;
	}
}
