const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/users");
const itemRouter = require("./routes/clothingItems");
const authRouter = require("./routes/index");
const { STATUS_CODES } = require("./utils/errors");
require("dotenv").config();

const { PORT = 3001 } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/", authRouter);
app.use("/items", itemRouter);
app.use((req, res) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
    console.log("Successfully connected to the wtwr_db database")
  } catch (error) {
    console.error("Error occured when connecting to database");
  }
})();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
