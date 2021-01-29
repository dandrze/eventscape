import {
  SET_LOADED,
  SET_SIDE_DRAWER_OPEN,
  SET_S3HASH,
  TRIGGER_CHAT_UPDATE,
} from "../actions/types";

export default function (
  state = {
    loaded: true,
    sideDrawerOpen: true,
    formSaved: false,
    s3Hash: null,
    triggerChatUpdate: true,
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
    case TRIGGER_CHAT_UPDATE:
      // simple toggle to trigger the useEffect function within stream-chat
      return { ...state, triggerChatUpdate: !state.triggerChatUpdate };
    default:
      return state;
  }
}
