const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for AddToCart
const addToCartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the 'Product' model
    required: true,
  },
  color_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color", // Reference to the 'Color' model
    required: true,
  },
  tone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tone", // Reference to the 'Tone' model
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the 'User' model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Define a Joi validation schema for AddToCart
function validateAddToCart(addToCart) {
  const schema = Joi.object({
    product_id: Joi.string().required(),
    color_id: Joi.string().required(),
    tone_id: Joi.string().required(),
    user_id: Joi.string().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(addToCart);
}

// Create the Mongoose model for AddToCart
const AddToCart = mongoose.model("AddToCart", addToCartSchema);

module.exports = {
  AddToCart,
  validateAddToCart,
};
