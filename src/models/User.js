const mongoose = require("mongoose");
//for hasshing and salt
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String, //the type
    unique: true, //has to be unique
    required: true, //is required to be in gform
  },
  password: {
    type: String, //the type

    required: true, //is required to be in gform
  },
});
//pre save hook this function will fire befor save
//must use the function notation in order to not have the this change
userSchema.pre("save", function (next) {
  //this is set to our user model
  const user = this;
  //if user has not modified password at all dont change anything
  if (!user.isModified("password")) {
    return next();
  }
  //generate ten rounds of salt check for errors
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    //add hash to the password and salt check for errors
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      //set the user password to hash
      user.password = hash;
      next();
    });
  });
});

//again must be function() notation because of this
//use async await so need to create a promise
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(false);
      }
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
