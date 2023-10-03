import { all } from "redux-saga/effects";
import authSagas from "./auth";
import productSagas from "./products";

export default function* rootSaga() {
  yield all([...authSagas, ...productSagas]);
}
