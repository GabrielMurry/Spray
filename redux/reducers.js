import { boulderGrades } from "../utils/constants/boulderConstants";
import {
  SET_USER,
  SET_USER_NAME,
  SET_USER_ID,
  SET_GYM,
  SET_SPRAYWALLS,
  UPDATE_SPRAYWALL,
  SET_SPRAYWALL_INDEX,
  SET_HEADSHOT_IMAGE,
  SET_BANNER_IMAGE,
  SET_FILTER_SORT_BY,
  SET_FILTER_MIN_GRADE_INDEX,
  SET_FILTER_MAX_GRADE_INDEX,
  SET_FILTER_CLIMB_TYPE,
  SET_FILTER_STATUS,
  SET_FILTER_CIRCUITS,
  REMOVE_FILTER_CIRCUITS,
  RESET_FILTER_CIRCUITS,
} from "./actions";

const initialState = {
  user: {},
  username: "",
  userID: "",
  gym: {},
  spraywalls: [],
  spraywallIndex: 0,
  headshotImage: {},
  bannerImage: {},
  filterSortBy: "popular",
  filterMinGradeIndex: 0,
  filterMaxGradeIndex: boulderGrades.length - 1,
  filterClimbType: "boulder",
  filterStatus: "all",
  filterCircuits: [],
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_USER_NAME:
      return { ...state, username: action.payload };
    case SET_USER_ID:
      return { ...state, userID: action.payload };
    case SET_HEADSHOT_IMAGE:
      return {
        ...state,
        headshotImage: {
          uri: action.payload.uri,
          width: action.payload.width,
          height: action.payload.height,
        },
      };
    case SET_BANNER_IMAGE:
      return {
        ...state,
        bannerImage: {
          uri: action.payload.uri,
          width: action.payload.width,
          height: action.payload.height,
        },
      };
    default:
      return state;
  }
}

export function gymReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GYM:
      return { ...state, gym: action.payload };
    default:
      return state;
  }
}

export function spraywallReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPRAYWALLS:
      return { ...state, spraywalls: action.payload };
    case UPDATE_SPRAYWALL:
      const { index, spraywall } = action.payload;
      const updatedSpraywalls = [...state.spraywalls];
      updatedSpraywalls[index] = { ...updatedSpraywalls[index], ...spraywall };
      return { ...state, spraywallArray: updatedSpraywalls };
    case SET_SPRAYWALL_INDEX:
      return { ...state, spraywallIndex: action.payload };
    case SET_FILTER_SORT_BY:
      return { ...state, filterSortBy: action.payload };
    case SET_FILTER_MIN_GRADE_INDEX:
      return { ...state, filterMinGradeIndex: action.payload };
    case SET_FILTER_MAX_GRADE_INDEX:
      return { ...state, filterMaxGradeIndex: action.payload };
    case SET_FILTER_CLIMB_TYPE:
      return { ...state, filterClimbType: action.payload };
    case SET_FILTER_STATUS:
      return { ...state, filterStatus: action.payload };
    case SET_FILTER_CIRCUITS:
      return {
        ...state,
        filterCircuits: [...state.filterCircuits, action.payload],
      };
    case REMOVE_FILTER_CIRCUITS:
      const updatedCircuits = state.filterCircuits.filter(
        (circuit) => circuit.id !== action.payload.id
      );
      return { ...state, filterCircuits: updatedCircuits };
    case RESET_FILTER_CIRCUITS:
      return { ...state, filterCircuits: [] };
    default:
      return state;
  }
}
