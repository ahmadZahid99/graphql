const mongoose = require("mongoose");
const {
  productCreation,
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
  // await Promise.all(
  //   prodectData.colors.map(async (data, index) => {
  //     await Promise.all(
  //       data.tones.map(async (toneData, toneIndex) => {
  //         const shades = await addPicByToneId(
  //           product_pic[`colors[${index}].tones[${toneIndex}].shade`]
  //         );
  //         prodectData.colors[index].tones[toneIndex].shades = shades;
  //       })
  //     );
  //   })
  // );

  const { error } = validateProduct(args);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const productDetail = await productCreation(args);

    if (!productDetail) {
      throw new Error(`Product could not be created .`);
    }

    return "Product created successfully!";
  } catch (error) {
    throw new Error(
      `"Something went wrong in user creation: " ${error.message}`
    );
  }
};

// @desc Addd to cart
// @route POST /product/addtocart
// @access Private
const addToCart = async (args) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { product_id, user_id, quantity } = args;

    const productData = await getProductById(product_id);

    if (!productData) {
      throw new Error("No products found");
    }

    const newQuantity =
      parseInt(productData.quantity, 10) - parseInt(quantity, 10);

    const updateProduct = await updateProductMiddleware(
      productData.id,
      { quantity: newQuantity },
      session
    );
    if (!updateProduct) {
      throw new Error(
        "Product could not be updated. Rollback occur during upadting Product"
      );
    }
    const cartData = {
      user_id,
      product_id,
      quantity,
    };

    if (cartData) {
      const { error } = validateAddToCart(cartData);
      if (error) {
        throw new Error(error.details[0].message);
      }
    }

    const createdCart = await addToCartMiddleware(cartData, session);
    if (!createdCart) {
      throw new Error(
        "Cart could not be created. Rollback occur during creating Cart"
      );
    }
    await session.commitTransaction();
    const product = await getProductMiddleware(product_id);

    return { message: "Add to cart successfully!", product };
  } catch (error) {
    await session.abortTransaction();

    throw new Error(
      `"Something went wrong in user creation: "${error.message}`
    );
  }
};

// @desc Get products data
// @route GET /product
// @access Private
const getAllProducts = async (req, res) => {
  try {
    //get all products
    const products = await getAllProductsMiddleware();

    if (!products) {
      throw new Error("No products found");
    }
    console.log(products);
    return products;
  } catch (error) {
    throw new Error(
      `Something went wrong while fetching products: ${error.message}`
    );
  }
};

// @desc Get product data by id
// @route GET /product/id
// @access Private
const getProductDetail = async (args) => {
  try {
    //get all products
    const products = await getProductMiddleware(args.id);

    if (!products) {
      throw new Error("No product found");
    }

    return products;
  } catch (error) {
    throw new Error(
      `"Something went wrong while fetching product: " ${error.message}`
    );
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductDetail,
  addToCart,
};
