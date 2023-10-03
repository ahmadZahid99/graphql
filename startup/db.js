const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://ahmad-zahid:zxkJqP4YyrRqw7tI@color-management.9zno7qn.mongodb.net/color-db?retryWrites=true&w=majority",
      { useUnifiedTopology: true }
    )
    .then(() => console.log("Database is connected"));
};
