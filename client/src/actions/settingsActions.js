import {
  SET_SIDE_DRAWER_OPEN,
  SET_LOADED,
  TRIGGER_SECTION_REACT_UPDATE,
} from "./types";

export const setSideDrawerOpen = (open) => {
  return { type: SET_SIDE_DRAWER_OPEN, payload: open };
};

export const setLoaded = (loaded) => {
  return { type: SET_LOADED, payload: loaded };
};

export const triggerSectionReactUpdate = () => {
  return { type: TRIGGER_SECTION_REACT_UPDATE };
};
