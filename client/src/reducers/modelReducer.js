import {
  UPDATE_PAGE_MODEL,
  FETCH_PAGE_MODEL,
  ADD_SECTION,
  UPDATE_SECTION,
  MOVE_SECTION,
  DELETE_SECTION,
  MODEL_ISSAVED,
  FLAG_UPDATE,
  UPDATE_REACT_COMPONENT,
  SIMULATE_HOVER,
  UPDATE_BACKGROUND,
} from "../actions/types";

export default function (
  state = {
    isUnsaved: false,
    status: "draft",
    sections: [],
    simulateHover: null,
    background: { color: "", image: "" },
  },
  action
) {
  switch (action.type) {
    case FLAG_UPDATE:
      return { ...state, isUnsaved: true };
    case UPDATE_SECTION:
      return {
        ...state,
        isUnsaved: true,
        sections: state.sections.map((section, index) => {
          if (index === action.payload.index) {
            return { ...section, html: action.payload.html };
          }
          return section;
        }),
      };
    case ADD_SECTION:
      return {
        ...state,
        isUnsaved: true,
        sections: [
          ...state.sections.slice(0, action.payload.index),
          action.payload.model,
          ...state.sections.slice(action.payload.index),
        ],
      };
    case DELETE_SECTION:
      return {
        ...state,
        isUnsaved: true,
        sections: state.sections.filter(
          (item, index) => index !== action.payload.index
        ),
      };
    case MOVE_SECTION:
      const newSections = state.sections.slice();
      newSections[action.payload.index] =
        state.sections[action.payload.index + action.payload.offset];
      newSections[action.payload.index + action.payload.offset] =
        state.sections[action.payload.index];
      return { ...state, isUnsaved: true, sections: newSections };
    case FETCH_PAGE_MODEL:
      return {
        ...state,
        isUnsaved: false,
        id: action.payload.id,
        sections: action.payload.sections,
      };
    case MODEL_ISSAVED:
      return { ...state, isUnsaved: false };
    case UPDATE_REACT_COMPONENT:
      return {
        ...state,
        isUnsaved: true,
        sections: state.sections.map((section, index) => {
          if (index === action.payload.index) {
            return {
              ...section,
              reactComponent: action.payload.reactComponent,
            };
          }
          return section;
        }),
      };
    case SIMULATE_HOVER:
      return { ...state, simulateHover: action.payload };
    case UPDATE_BACKGROUND:
      return { ...state, background: action.payload };
    default:
      return state;
  }
}

const insertItem = (array, item, index) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};
