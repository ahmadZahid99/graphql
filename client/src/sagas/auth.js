import { takeEvery, call, put, fork, takeLatest } from "redux-saga/effects";
import * as types from "../actions";
import * as actions from "../actions/auth";
import { gql } from "@apollo/client";
import client from "../graphqlClient";
import * as api from "../api/auth";

import { setSession } from "../auth/utils";

function* initSession({ payload }) {
  try {
    console.log(payload.token);
    setSession(payload.token);
  } catch (e) {
    if (
      e.message === "Error: Not authorized, no token" ||
      e.message === "JsonWebTokenError: invalid signature"
    ) {
      setSession(null);
      yield put(actions.logoutRequest());
    }

    yield put(
      actions.loginError({
        error: e.message,
      })
    );
  }
}

function* watchInitSession() {
  yield takeLatest(types.INITIALIZE_SESSION, initSession);
}

function* getUsers(payload) {
  try {
    const result = yield call(api.getUser);

    yield put(
      actions.getUserSuccess({
        items: result.data,
        accessToken: payload.accessToken,
      })
      // isAuthenticated: true,
    );
  } catch (e) {
    // isAuthenticated:
    //       action.payload.error === 'Error: Not authorized, no token'
    //         ? false
    //         : state.isAuthenticated,
    //     user: action.payload.error === 'Error: Not authorized, no token' ? false : state.user,
    //     token: action.payload.error === 'Error: Not authorized, no token' ? false : state.token,
    if (e.message === "Error: Not authorized, no token") {
      setSession(null);
      yield put(actions.logoutRequest());
    }

    yield put(
      actions.loginError({
        error: e.message,
      })
    );
  }
}

function* watchGetUserRequest() {
  yield takeLatest(types.GET_USER_REQUEST, getUsers);
}

function* registerSaga({ payload }) {
  try {
    const REGISTOR_USER = gql`
      mutation Register(
        $full_name: String!
        $email: String!
        $password: String!
      ) {
        register(full_name: $full_name, email: $email, password: $password)
      }
    `;

    const response = yield call(client.mutate, {
      mutation: REGISTOR_USER,
      variables: {
        full_name: payload.full_name,
        email: payload.email,
        password: payload.password,
      },
    });

    yield put(actions.initializeSession(response.data.register));
    const result = yield call(api.getUser);
    // getting the current user

    yield put(actions.loginUserSuccess({ token: response.data.register }));
    yield put(
      actions.getUserSuccess({
        items: result.data,
        accessToken: response.data.register,
      })
    );

    // yield put(actions.registerUserSuccess({ message: response.data.message }));
  } catch (e) {
    yield put(
      actions.loginError({
        error: e,
      })
    );
  }
}

function* loginSaga(payload) {
  try {
    const LOGIN_USER = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;

    const response = yield call(client.mutate, {
      mutation: LOGIN_USER,
      variables: {
        email: payload.user.email,
        password: payload.user.password,
      },
    });

    yield put(actions.initializeSession(response.data.login));
    const result = yield call(api.getUser);
    // getting the current user

    yield put(actions.loginUserSuccess({ token: response.data.login }));
    yield put(
      actions.getUserSuccess({
        items: result.data,
        accessToken: response.data.login,
      })
    );
  } catch (e) {
    yield put(
      actions.loginError({
        error: e.message || e,
      })
    );
  }
}

function* watchUserAuthentication() {
  yield takeLatest(types.REGISTER_USER_REQUEST, registerSaga);
  yield takeLatest(types.LOGIN_USER, loginSaga);
}
function* logout() {
  try {
    setSession(null);
    yield put(actions.logoutSuccess());
  } catch (e) {
    yield put(
      actions.loginError({
        error: e.message || e,
      })
    );
  }
}

function* watchLogoutRequest() {
  yield takeEvery(types.LOGOUT_REQUEST, logout);
}

const authSagas = [
  fork(watchInitSession),
  fork(watchGetUserRequest),
  fork(watchUserAuthentication),
  fork(watchLogoutRequest),
];

export default authSagas;
