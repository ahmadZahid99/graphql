const mongoose = require("mongoose");
const Joi = require("joi");
const { colorSchema, validateColor } = require("./color");
// Define a schema for Products
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    colors: [colorSchema],
  },
  {
    timestamps: true,
  }
);

//joi validation
function validateProduct(product) {
  const schema = Joi.object({
    title: Joi.string().max(50).required(),
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    colors: Joi.array().items(validateColor),
  });
  return schema.validate(product);
}

// Create a Mongoose model for Products
const Products = mongoose.model("Products", productSchema);

module.exports = {
  Products,
  validateProduct,
};
