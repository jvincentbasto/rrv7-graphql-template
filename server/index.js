const colors = require("colors");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./graphql/http/schemas/schema");

const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(
  "/graphql",
  createHandler({
    schema,
  })
);
app.listen(
  port,
  console.log(
    `Server running on port:`,
    `http://localhost:${port}`.green.underline.bold
  )
);
