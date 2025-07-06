const express = require("express");
const mongoose = require("mongoose")
const userRouter = require("./routes/users");
const itemRouter = require("./routes/clothingItems")
const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json())



app.use('/users', userRouter)

app.use((req, res, next) => {
  req.user = {
    _id: '686acf37a6f4f0b72d2a50e4'
  }
  next()
})

app.use("/items", itemRouter)
app.use((req, res) => {
  res.status(404).json({message: "Requested resource not found"})
})

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
