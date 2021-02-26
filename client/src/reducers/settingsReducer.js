import {
  SET_LOADED,
  SET_SIDE_DRAWER_OPEN,
  TRIGGER_SECTION_REACT_UPDATE,
} from "../actions/types";

export default function (
  state = {
    loaded: true,
    sideDrawerOpen: true,
    formSaved: false,
    s3Hash: null,
    triggerSectionReactUpdate: true,
  },
  action
) {
  switch (action.type) {
    case SET_LOADED:
      return { ...state, loaded: action.payload };
    case SET_SIDE_DRAWER_OPEN:
      return { ...state, sideDrawerOpen: action.payload };
    case TRIGGER_SECTION_REACT_UPDATE:
      // simple toggle to trigger the useEffect function within stream-chat
      return {
        ...state,
        triggerSectionReactUpdate: !state.triggerSectionReactUpdate,
      };
    default:
      return state;
  }
}
