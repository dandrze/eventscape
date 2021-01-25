import { SET_LOADED, SET_SIDE_DRAWER_OPEN } from "../actions/types";

export default function (
  state = {
    loaded: true,
    sideDrawerOpen: true,
    formSaved: false,
  },
  action
) {
  switch (action.type) {
    case SET_LOADED:
      return { ...state, loaded: action.payload };
    case SET_SIDE_DRAWER_OPEN:
      return { ...state, sideDrawerOpen: action.payload };
    default:
      return state;
  }
}
