import { SET_LOADED, SET_SIDE_DRAWER_OPEN, SET_S3HASH } from "../actions/types";

export default function (
  state = {
    loaded: true,
    sideDrawerOpen: true,
    formSaved: false,
    s3Hash: null,
  },
  action
) {
  switch (action.type) {
    case SET_LOADED:
      return { ...state, loaded: action.payload };
    case SET_SIDE_DRAWER_OPEN:
      return { ...state, sideDrawerOpen: action.payload };
    case SET_S3HASH:
      return { ...state, s3Hash: action.payload };
    default:
      return state;
  }
}
