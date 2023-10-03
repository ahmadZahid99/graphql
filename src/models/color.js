const mongoose = require("mongoose");
const Joi = require("joi");
const { toneSchema, validateTones } = require("./tones");

// Define a schema for Colors
const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },

    tones: [toneSchema], // Embed tones within colors
  },
  {
    timestamps: true,
  }
);

// Define a Joi validation schema for Colors
function validateColor(color) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    tones: Joi.array().items(validateTones), // Validate each tone within the array
  });
  return schema.validate(color);
}

// const Color = mongoose.model("Colors", colorSchema);

module.exports = {
  colorSchema,
  // Color,
  validateColor,
};
