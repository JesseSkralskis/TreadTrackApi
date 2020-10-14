// model files need to be excucuted at top level to work throuout application
require("./models/User");
require("./models/Track");
require("dotenv").config({ path: "src/.env" });
//create express server

const express = require("express");
//get auth into index can now use in any request handlers
const requireAuth = require("./middlewares/requireAuth");
const mongoose = require("mongoose");
//need to import the routes
const authRoutes = require("./routes/uathRoutes");
const trackRoutes = require("./routes/trackRoutes");
const bodyParser = require("body-parser");
const app = express();
//make use of bodyParser must be before the Routes
//this becoms the req.body parsed out
app.use(bodyParser.json());
//connect the router to the app express instance
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = process.env.DATABASE_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

//to know we are connected to mongo db
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});
//to allow for error handeling
mongoose.connection.on("error", (err) => {
  console.err("could not connect to mongo db", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on Port 3000");
});
