import {
  CHANGE_PAGE_EDITOR,
  SET_LOADED,
  SET_SIDE_DRAWER_OPEN,
} from "../actions/types";

export default function (
  state = {
    nowEditingPage: "event",
    loaded: true,
    sideDrawerOpen: true,
    formSaved: false,
  },
  action
) {
  switch (action.type) {
    case CHANGE_PAGE_EDITOR:
      return { ...state, nowEditingPage: action.payload };
    case SET_LOADED:
      return { ...state, loaded: action.payload };
    case SET_SIDE_DRAWER_OPEN:
      return { ...state, sideDrawerOpen: action.payload };
    default:
      return state;
  }
}
