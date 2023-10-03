const Joi = require("joi");
const mongoose = require("mongoose");

// Schema and Model
const schemaUser = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 125,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//joi validation
function validateUser(user) {
  const schema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().min(5).max(255).required(),
    is_admin: Joi.boolean(),
  });
  return schema.validate(user);
}

const Users = mongoose.model("users", schemaUser);
exports.Users = Users;
exports.validateUser = validateUser;
