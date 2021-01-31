import {
  SET_JWT,
  LOGIN_ERROR,
  RESET_LOGIN_ERROR,
  GET_USER_INFO,
  USER_INFO_ERROR,
  RESET_USER_INFO_ERROR,
  REGISTER,
  REGISTER_ERROR,
  RESET_REGISTER_ERROR,
  RESET_REGISTER_SUCCESS,
} from "./constants";
import { reduxAction } from "../../types/actions.type";
import requestService from "../../common/requestService";

export async function loginAndSetJWT(
  username: string,
  password: string
): Promise<reduxAction> {
  try {
    const response = await requestService.post("auth/login", {
      username: username,
      password: password,
    });
    requestService.setJwt(response.data.access_token);
    return {
      type: SET_JWT,
      payload: response.data.access_token,
    };
  } catch (e) {
    return {
      type: LOGIN_ERROR,
    };
  }
}

export function resetLoginError(): reduxAction {
  return {
    type: RESET_LOGIN_ERROR,
  };
}

export async function getUserConnectedInfo() {
  try {
    const response = await requestService.get("users/me");
    return {
      type: GET_USER_INFO,
      payload: response.data,
    };
  } catch (e) {
    return {
      type: USER_INFO_ERROR,
    };
  }
}

export function resetUserInfoError(): reduxAction {
  return {
    type: RESET_USER_INFO_ERROR,
  };
}

export async function register(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<reduxAction> {
  if (password !== confirmPassword) {
    return {
      type: REGISTER_ERROR,
      payload: "Passwords dont match",
    };
  }
  try {
    await requestService.post("users/register", {
      username: username,
      email: email,
      password: password,
    });
    return {
      type: REGISTER,
    };
  } catch (e) {
    return {
      type: REGISTER_ERROR,
      payload: "User or email already exists",
    };
  }
}

export function resetRegisterError(): reduxAction {
  return {
    type: RESET_REGISTER_ERROR,
  };
}

export function resetRegisterSuccess(): reduxAction {
  return {
    type: RESET_REGISTER_SUCCESS,
  };
}
