// ***********MIdleware that extracts autorization********
// ******grabs user id out of it*********
//******uses that id to find the correct user in db */
//then assigns that user model to the req. param

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//bringing our User model
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  //how to auth
  //1. destructure out auth header from
  const { authorization } = req.headers;
  //2 if user didnt allow then
  if (!authorization) {
    return res.status(401).send({ error: "You Must be logged In" });
  }
  // to get the token alone without the bearer
  const token = authorization.replace("Bearer ", "");
  //need to verify token
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    //error handling
    if (err) {
      return res.status(401).send({ error: "you must be logged in" });
    }

    try {
      //get the user Id out of the payload jwt verification
      const { userId } = payload;
      //tells mongoose to go take a look at our collection find a user with the given id
      //when it finds it it will asign it to the user variable
      const user = await User.findById(userId);
      //to give access to this user everywhere else we attach it to the req param
      //because of this step we can now always access user id by
      // req.user._id
      //attaching the user to the req so we can access everything from that user in data base
      req.user = user;
      //call next because user has been verified
      next();
    } catch (err) {
      console.log(err.message);
    }
  });
};
