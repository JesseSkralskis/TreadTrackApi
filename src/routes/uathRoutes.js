const express = require("express");
const mongoose = require("mongoose");
//bring in the token library
const jwt = require("jsonwebtoken");

//how to get the monggose model

//this User is how we interact with everything stored in mongo db
const User = mongoose.model("User");

//create a router allows for root handling
//can be associated with the app
const router = express.Router();

//validator
const { check, validationResult } = require("express-validator");

router.post(
  "/signup",
  [check("email", "Your email is not valid").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      try {
        const { email, password } = req.body;

        // create a user with the password and email we provided in the body
        // error handling with try catch

        const user = new User({ email, password });

        //async function so we use async await
        await user.save();
        //make token pass in value to encrypt , then a chosen secret key
        const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
        //send a response with the token
        res.send({ token });
      } catch (err) {
        res.status(400).send({ error: "email already exists" });
      }
    }
  }
);

router.post("/signin", async (req, res) => {
  //pull the email and password off the req.body

  const { email, password } = req.body;
  //catch if there is no password or email
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }
  // check that there is a user with that email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "no email by that name" });
  }
  //if there is a user check if the hashed passwordes match
  // if match is true
  // create a token with the same secret key
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

// how to export the router for other files to use
module.exports = router;
