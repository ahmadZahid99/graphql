import axios from "../utils/axios";

export const getProduct = () => axios.get("/product");

export const createProduct = (data) =>
  axios.post("/product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const addToCart = (data) => axios.post("/product/addtocart", data);

export const getProductById = ({ productId }) =>
  axios.get(`/product/${productId}`);
