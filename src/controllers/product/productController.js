const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const {
  productCreation,
  addPicByToneId,
  getAllProductsMiddleware,
  getProductMiddleware,
  refactorProductList,
  refactorProduct,
  getProductById,
  updateProductMiddleware,
  addToCartMiddleware,
} = require("./productHelper");
const { validateProduct } = require("../../models/products");
const { validateAddToCart } = require("../../models/addToCart");

// @desc Create new product
// @route POST /product
// @access Private
// const createProduct = asyncHandler(async (req, res) => {
const createProduct = async (args) => {
  // if (!req.result.is_admin) {
  //   res.status(400);
  //   throw new Error("You are not allowed to perform this action");
  // }

  const prodectData = JSON.parse(req.body.productData);
  const product_pic = req?.files;

  await Promise.all(
    prodectData.colors.map(async (data, index) => {
      await Promise.all(
        data.tones.map(async (toneData, toneIndex) => {
          const shades = await addPicByToneId(
            product_pic[`colors[${index}].tones[${toneIndex}].shade`]
          );
          prodectData.colors[index].tones[toneIndex].shades = shades;
        })
      );
    })
  );

  if (prodectData) {
    const { error } = validateProduct(prodectData);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }

  try {
    // Create the main product
    const productDetail = await productCreation(prodectData);

    if (!productDetail) {
      throw new Error(`Product could not be created .`);
    }

    return productDetail;
  } catch (error) {
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong in user creation: "
          : ""
      }${error.message}`
    );
  }
};
// @desc Addd to cart
// @route POST /product/addtocart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = req.body;

    const productData = await getProductById(product.product_id);

    if (!productData) {
      res.status(400);
      throw new Error("No products found");
    }

    const newQuantity =
      parseInt(productData.quantity, 10) - parseInt(product.quantity, 10);

    const updateProduct = await updateProductMiddleware(
      productData.id,
      { quantity: newQuantity },
      session
    );
    if (!updateProduct) {
      res.status(400);
      throw new Error(
        "Product could not be updated. Rollback occur during upadting Product"
      );
    }
    const cartData = { user_id: req.result.id, ...product };

    if (cartData) {
      const { error } = validateAddToCart(cartData);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }

    const createdCart = await addToCartMiddleware(cartData, session);
    if (!createdCart) {
      res.status(400);
      throw new Error(
        "Cart could not be created. Rollback occur during creating Cart"
      );
    }
    await session.commitTransaction();

    return res.status(200).json({ message: "Add to cart successfully!" });
  } catch (error) {
    await session.abortTransaction();
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong in user creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get products data
// @route GET /product
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //get all products
    const products = await getAllProductsMiddleware();

    if (!products) {
      res.status(400);
      throw new Error("No products found");
    }

    const refactor = refactorProductList(products);

    res.status(200).json({
      products: refactor,
    });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong while fetching products: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get product data by id
// @route GET /product/id
// @access Private
const getProductDetail = asyncHandler(async (req, res) => {
  try {
    //get all products
    const products = await getProductMiddleware(req.params.id);

    if (!products) {
      res.status(400);
      throw new Error("No product found");
    }

    const productrefactore = refactorProduct(products);

    res.status(200).json({
      products: productrefactore,
    });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong while fetching product: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductDetail,
  addToCart,
};
