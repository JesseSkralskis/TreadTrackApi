const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

//get the Track model here
//track file must be required in one location
const Track = mongoose.model("Track");
//create router
const router = express.Router();
//in order for any one to have access to these routes they must be logged in
router.use(requireAuth);

//first route handler will allow user to get all the tracks ever created

router.get("/tracks", async (req, res) => {
  //who is the current user need to get id
  //so we we query on Track to find all the user id that match the current user
  const tracks = await Track.find({ userId: req.user._id });

  //send back the tracks in the response
  res.send(tracks);
});
// 2 route handler allows user to add tracks
router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;
  if (!name || !locations) {
    return res.status(422).send({ error: "there were no names or locations" });
  }
  //create new track with the properties
  try {
    const track = new Track({ name, locations, userId: req.user._id });
    //now we can save to data base
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

//handler that deletes track
router.put("/tracks", async (req, res) => {
  try {
    const tracks = await Track.find({ _id: req.body.id });

    await Track.findOneAndDelete({ _id: req.body.id }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted", docs);
        res.send(tracks);
      }
    });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// export the router
module.exports = router;
