const cors = require("cors");
const express = require("express");
const app = express();
const cookies = require("cookie-parser");
const route = require("./route");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(cookies());

mongoose.connect(process.env.DB, { useNewUrlParser: true })
.then(() => console.log("MongoDb is connected"))
.catch((err) => console.log(err));

app.use("/", route);

app.listen(8800, function () {
  console.log("Server is running...");
});