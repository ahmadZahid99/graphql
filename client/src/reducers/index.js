import { combineReducers } from "redux";
import AuthReducer from "./auth";
import ProductReducer from "./products";

export default combineReducers({
  Auth: AuthReducer,
  Product: ProductReducer,
});
