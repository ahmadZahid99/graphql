import { takeEvery, call, put, fork, takeLatest } from "redux-saga/effects";
import * as types from "../actions";
import * as actions from "../actions/auth";
import { GET_USER } from "../queries/userQueries";
import { REGISTOR_USER, LOGIN_USER } from "../mutations/userMutations";
import client from "../graphqlClient";
import { setSession } from "../auth/utils";

function* initSession({ payload }) {
  try {
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
    const result = yield call(client.query, {
      query: GET_USER,
      variables: {
        token: payload.accessToken,
      },
    });

    yield put(
      actions.getUserSuccess({
        items: result.data.user,
        accessToken: payload.accessToken,
      })
    );
  } catch (e) {
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
    const response = yield call(client.mutate, {
      mutation: REGISTOR_USER,
      variables: {
        full_name: payload.full_name,
        email: payload.email,
        password: payload.password,
      },
    });

    yield put(actions.initializeSession(response.data.register));

    const result = yield call(client.query, {
      query: GET_USER,
      variables: {
        token: response.data.register,
      },
    });

    yield put(actions.loginUserSuccess({ token: response.data.register }));
    yield put(
      actions.getUserSuccess({
        items: result.data.user,
        accessToken: response.data.register,
      })
    );
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
    const response = yield call(client.mutate, {
      mutation: LOGIN_USER,
      variables: {
        email: payload.user.email,
        password: payload.user.password,
      },
    });

    yield put(actions.initializeSession(response.data.login));

    const result = yield call(client.query, {
      query: GET_USER,
      variables: {
        token: response.data.login,
      },
    });

    yield put(actions.loginUserSuccess({ token: response.data.login }));
    yield put(
      actions.getUserSuccess({
        items: result.data.user,
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
