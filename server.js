const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.port || 3000;

const DB = process.env.DATABASE;
mongoose.connect(DB).then((con) => {
  console.log("Connection is successful!");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
