const express = require("express");
const categoryRouter = require("./routes/categoryRoutes");

const app = express();

app.use(express.json());

//Routes
app.use("/api/v1/categories", categoryRouter);

module.exports = app;
