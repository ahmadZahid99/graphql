import { takeEvery, call, put, fork } from "redux-saga/effects";
import * as actions from "../actions/products";
import * as authActions from "../actions/auth";
import * as api from "../api/product";
import * as types from "../actions";
import { setSession } from "../auth/utils";

function* getProduct() {
  try {
    const result = yield call(api.getProduct);

    yield put(
      actions.getProductSuccess({
        items: result.data.products,
      })
    );
  } catch (e) {
    if (e.message === "Error: Not authorized, no token") {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.productError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetProductRequest() {
  yield takeEvery(types.GET_PRODUCT_REQUEST, getProduct);
}

function* createProduct({ payload }) {
  try {
    const formData = new FormData();

    formData.append("productData", JSON.stringify(payload));
    // Add simple key-value pairs

    // Add nested key-value pairs, including file objects
    payload.colors.forEach((color, colorIndex) => {
      color.tones.forEach((tone, toneIndex) => {
        // Append the file to FormData
        formData.append(
          `colors[${colorIndex}].tones[${toneIndex}].shade`,
          tone.shade
        );
      });
    });
    const response = yield call(api.createProduct, formData);

    yield put(
      actions.createProductSuccess({
        message: response.data.message,
      })
    );
  } catch (e) {
    if (e.message === "Error: Not authorized, no token") {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.productError({
          error: e.message,
        })
      );
    }
  }
}

function* watchCreateProductRequest() {
  yield takeEvery(types.CREATE_PRODUCT_REQUEST, createProduct);
}
function* addToCart({ payload }) {
  try {
    const response = yield call(api.addToCart, payload);

    yield put(
      actions.addToCartSuccess({
        message: response.data.message,
      })
    );

    yield put(actions.getProductByIdRequest(payload.product_id));
  } catch (e) {
    if (e.message === "Error: Not authorized, no token") {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.productError({
          error: e.message,
        })
      );
    }
  }
}

function* watchAddToCartRequest() {
  yield takeEvery(types.ADD_TO_CART_REQUEST, addToCart);
}

function* getProductById({ payload }) {
  try {
    const result = yield call(api.getProductById, payload);

    yield put(
      actions.getProductByIdSuccess({
        productDetails: result.data.products,
      })
    );
  } catch (e) {
    if (e.message === "Error: Not authorized, no token") {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.productError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetProductByIdRequest() {
  yield takeEvery(types.GET_PRODUCT_BY_ID_REQUEST, getProductById);
}

const productSagas = [
  fork(watchGetProductRequest),
  fork(watchCreateProductRequest),
  fork(watchGetProductByIdRequest),
  fork(watchAddToCartRequest),
];

export default productSagas;
