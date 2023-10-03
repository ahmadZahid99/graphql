const http = require("http");
const express = require("express");
const colors = require("colors");
let cors = require("cors");

require("dotenv").config();

const { graphqlHTTP } = require("express-graphql");

const schema = require("./startup/schema");

app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

const server = http.createServer(app);
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();

require("./startup/prod")(app);

const port = process.env.PORT || 6062;

server.listen(port, () => console.log(`Server started on port ${port}`));
