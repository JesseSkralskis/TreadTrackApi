const mongoose = require("mongoose");

// create the model
const pointSchema = new mongoose.Schema({
  // phone returns time as a number of milliseconds since 1970
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});
const trackSchema = new mongoose.Schema({
  userId: {
    //reference to some other object in mongo db
    type: mongoose.Schema.Types.ObjectId,
    //ref "User" points to the userId is pointing to mongoose.model("User", userSchema);
    ref: "User",
  },
  name: {
    type: String,
    default: "",
  },
  //pointSchema is a schema object that we will define
  locations: [pointSchema],
});

// load schema into mongoose
mongoose.model("Track", trackSchema);
