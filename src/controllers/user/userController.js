const bcrypt = require("bcryptjs");
const { getUserById, findUser, userCreation } = require("./userHelper");

const jwt = require("jsonwebtoken");

const {
  generateToken,
  expressValidatorError,
} = require("../../middleware/commonMiddleware");
const { validateUser } = require("../../models/users");

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = async (args) => {
  //validate param data
  // expressValidatorError(req);
  const { email, password } = args;
  try {
    //check user email verification
    const user = await findUser(email);

    if (!user) {
      throw new Error("No user found!");
    }

    //check password and give token
    if (user && (await bcrypt.compare(password, user.password))) {
      return generateToken(user);
    } else {
      throw new Error("Invalid credentials or user not found.");
    }
  } catch (error) {
    //error handling

    throw new Error(`Something went wrong during login: ${error.message}`);
  }
};

// @desc Create new user
// @route POST /api/users
// @access Private
const createUser = async (args) => {
  //validate user

  if (args) {
    const { error } = validateUser(args);
    if (error) {
      return error.details[0].message;
    }
  }

  try {
    //check if args exist
    const userExists = await findUser(args.email);
    if (userExists) {
      throw new Error("User already exists with same email address");
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptPass = await bcrypt.hash(args.password, salt);
    args.password = encryptPass;

    //create args
    const result = await userCreation(args);
    if (!result) {
      throw new Error("User could not be created!");
    }

    return generateToken(result);
  } catch (error) {
    throw new Error(`Something went wrong in user creation: ${error.message}`);
  }
};

// @desc get logedin user
// @route GET /api/users/
// @access Private
const getUser = async (args) => {
  const { token } = args;

  if (!token) {
    throw new Error("Not authorized, no token.");
  }

  try {
    //Get token from header
    //verfiy token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Get user from token

    const user = await getUserById(decoded.id);

    if (!user) {
      throw new Error("Not authorized, no token");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

// const getUser = asyncHandler(async (req, res) => {
//   res.json(req.result);
// });

module.exports = {
  createUser,
  loginUser,
  getUser,
};
