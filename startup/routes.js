const express = require("express");

const fileUpload = require("express-fileupload");

const { errorHandler } = require("../src/middleware/errorMiddleware"),
  seeder = require("../src/routes/seeder/seeder"),
  user = require("../src/routes/users/users"),
  product = require("../src/routes/product/product");

module.exports = function (app) {
  app.use(express.static("public"));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(fileUpload());

  app.use("/seeder", seeder);
  app.use("/users", user);
  app.use("/product", product);

  app.use(errorHandler);
};
