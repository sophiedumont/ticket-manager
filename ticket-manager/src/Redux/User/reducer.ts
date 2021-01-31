import {
  LOGIN_ERROR,
  RESET_LOGIN_ERROR,
  SET_JWT,
  GET_USER_INFO,
  USER_INFO_ERROR,
  RESET_USER_INFO_ERROR,
  REGISTER_ERROR,
  REGISTER,
  RESET_REGISTER_ERROR,
  RESET_REGISTER_SUCCESS,
  REHYDRATE,
  UNSET_JWT,
} from "./constants";
import { reduxAction } from "../../types/actions.type";
import requestService from "../../common/requestService";

export interface userStore {
  jwt: string;
  canUseApp: boolean;
  loginError: boolean;
  register: boolean;
  registerError: boolean;
  errorMessage: string;
  getUserError: boolean;
  userInfo: { id: string; username: string };
}

const initialState = {
  jwt: "",
  loginError: false,
  canUseApp: false,
  errorMessage: "User or email already exists",
  userInfo: {},
  getUserError: false,
  register: false,
  registerError: false,
};

function reducer(state = initialState, action: reduxAction) {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload.user.jwt) {
        requestService.setJwt(action.payload.user.jwt);
      }
      return state;
    case SET_JWT:
      return { ...state, jwt: action.payload, canUseApp: true };
    case UNSET_JWT:
      return { ...state, jwt: action.payload, canUseApp: false };
    case LOGIN_ERROR:
      return { ...state, loginError: true };
    case RESET_LOGIN_ERROR:
      return { ...state, loginError: false };
    case GET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case USER_INFO_ERROR:
      return { ...state, getUserError: true };
    case RESET_USER_INFO_ERROR:
      return { ...state, getUserError: false };
    case REGISTER:
      return { ...state, register: true };
    case REGISTER_ERROR:
      return { ...state, registerError: true, errorMessage: action.payload };
    case RESET_REGISTER_ERROR:
      return {
        ...state,
        registerError: false,
        errorMessage: initialState.errorMessage,
      };
    case RESET_REGISTER_SUCCESS:
      return { ...state, register: false };
    default:
      return state;
  }
}

export default reducer;
