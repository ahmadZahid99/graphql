const mongoose = require("mongoose");
const Joi = require("joi");

// Define a schema for Pictures
const pictureSchema = new mongoose.Schema(
  {
    file_name: {
      type: String,
      required: true,
    },
    file_data: {
      type: Buffer, // Store binary data as a Buffer
      required: true,
    },
    file_size: {
      type: Number,
      required: true,
      max: 4194304, // 4 MB
    },
    file_mimetype: {
      type: String,
      required: true,
      enum: ["image/png", "image/jpeg"],
    },
    // tone_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Tone', // Reference to the 'Tone' model
    //   required: true,
    //   unique: true,
    // },
  },
  {
    timestamps: true,
  }
);

// Define a Joi validation schema for Pictures
function validatePicture(picture) {
  const schema = Joi.object({
    file_name: Joi.string().required(),
    file_data: Joi.any().required(),
    file_size: Joi.number().integer().max(4194304).required(), // 4 MB
    file_mimetype: Joi.string().valid("image/png", "image/jpeg").required(),
    // tone_id: Joi.string().guid().required(),
  });
  return schema.validate(picture);
}

module.exports = {
  pictureSchema,
  validatePicture,
};
