const { Products } = require("../../models/products");
const { AddToCart } = require("../../models/addToCart");

const updateProductMiddleware = (id, newQuantity, session) => {
  return Products.findByIdAndUpdate(id, newQuantity)
    .session(session)
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const addToCartMiddleware = async (cartDetail, session) => {
  try {
    const result = await AddToCart.create([cartDetail], { session: session });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProductsMiddleware = () => {
  return Products.find({})
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const getProductMiddleware = (id) => {
  return Products.findById(id)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
const getProductById = (id) => {
  return Products.findById(id)
    .select("title description quantity")
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const refactorProductList = (products) => {
  let productList = [];
  products.map((product) => {
    let imageList = [];
    const productData = new Object();
    productData.id = product._id;
    productData.title = product.title;
    productData.description = product.description;

    productList.push(productData);
  });

  return productList;
};
const refactorProduct = (product) => {
  let imageList = [];

  const productData = new Object();
  productData.id = product._id;
  productData.title = product.title;
  productData.description = product.description;
  productData.available = product.quantity;

  return productData;
};

async function productCreation(productDetail) {
  try {
    const result = new Products(productDetail);
    const product = await result.save();
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//
module.exports = {
  productCreation,
  getAllProductsMiddleware,
  getProductMiddleware,
  refactorProductList,
  refactorProduct,
  getProductById,
  updateProductMiddleware,
  addToCartMiddleware,
};
