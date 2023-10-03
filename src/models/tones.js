const mongoose = require("mongoose");
const Joi = require("joi");
const { pictureSchema, validatePicture } = require("./pictures");

// Define a schema for Tones
const toneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    shades: pictureSchema, // Embed shades within tones
  },
  {
    timestamps: true,
  }
);

// Define a Joi validation schema for Tones
function validateTones(tone) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    shades: validatePicture(tone.shades),
  });
  return schema.validate(tone);
}

// Create a Mongoose model for Tones
// const Tones = mongoose.model("Tones", toneSchema);

module.exports = {
  toneSchema,
  // Tones,
  validateTones,
};
