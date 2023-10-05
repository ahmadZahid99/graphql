import { takeEvery, call, put, fork } from "redux-saga/effects";
import * as actions from "../actions/products";
import * as authActions from "../actions/auth";

import * as types from "../actions";
import { setSession } from "../auth/utils";
import client from "../graphqlClient";
import { GET_ALL_PRODUCT, GET_PRODUCT_BY_ID } from "../queries/productQueries";
import { CREATE_PRODUCT, ADD_TO_CART } from "../mutations/productMutations";

function* getProduct() {
  try {
    const result = yield call(client.query, {
      query: GET_ALL_PRODUCT,
    });

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
    // const formData = new FormData();

    // formData.append("productData", JSON.stringify(payload));
    // // Add simple key-value pairs

    // // Add nested key-value pairs, including file objects
    // payload.colors.forEach((color, colorIndex) => {
    //   color.tones.forEach((tone, toneIndex) => {
    //     // Append the file to FormData
    //     formData.append(
    //       `colors[${colorIndex}].tones[${toneIndex}].shade`,
    //       tone.shade
    //     );
    //   });
    // });
    console.log(payload);
    const response = yield call(client.mutate, {
      mutation: CREATE_PRODUCT,
      variables: {
        title: payload.title,
        description: payload.description,
        quantity: parseInt(payload.quantity, 10),
      },
    });

    yield put(
      actions.createProductSuccess({
        message: response.data.createProduct,
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
      console.log(e);
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
    const response = yield call(client.mutate, {
      mutation: ADD_TO_CART,
      variables: {
        user_id: payload.user_id,
        product_id: payload.product_id,
        quantity: payload.quantity,
      },
    });

    yield put(
      actions.addToCartSuccess({
        message: response.data.addToCart.message,
      })
    );
    yield put(
      actions.getProductByIdSuccess({
        productDetails: response.data.addToCart.product,
      })
    );
    // yield put(actions.getProductByIdRequest(payload.product_id));
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
    const result = yield call(client.query, {
      query: GET_PRODUCT_BY_ID,
      variables: { id: payload.productId },
    });

    yield put(
      actions.getProductByIdSuccess({
        productDetails: result.data.product,
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
