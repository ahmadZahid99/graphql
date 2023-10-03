const { Users } = require("../../models/users");

// find user with email address
function findUser(email) {
  return Users.findOne({ email: email })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

// create user
async function userCreation(userDetail) {
  try {
    const result = new Users(userDetail);
    const user = await result.save();
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

// Send mesage to db
const getUserById = (userId) => {
  return Users.findById(userId)
    .select("-password")
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = {
  findUser,
  userCreation,
  getUserById,
};
