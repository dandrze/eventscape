import { CHANGE_PAGE_EDITOR } from "./types";

export const changePageEditor = (pageName) => {
	return { type: CHANGE_PAGE_EDITOR, payload: pageName };
};
