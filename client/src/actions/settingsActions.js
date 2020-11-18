import { CHANGE_PAGE_EDITOR, SET_SIDE_DRAWER_OPEN } from "./types";

export const changePageEditor = (pageName) => {
	return { type: CHANGE_PAGE_EDITOR, payload: pageName };
};

export const setSideDrawerOpen = (open) => {
	return { type: SET_SIDE_DRAWER_OPEN, payload: open };
};
