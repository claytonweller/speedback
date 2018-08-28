const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Feedback } = require("./models");
const { EventModel } = require("../events/models");
const { jwtStrategy } = require("../auth");

router.use(express.json());
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate("jwt", { session: false });

router.get("/:eventId", jwtAuth, (req, res) => {
  EventModel.findById(req.params.eventId)
    .then(event => {
      if (req.user.hostId !== String(event.host)) {
        return res(400).json({
          message: "You do not have access to this information"
        });
      }
      return Feedback.find({ eventId: req.params.eventId });
    })
    .then(feedbackArray => {
      let serializedFeedback = feedbackArray.map(feedback =>
        feedback.serialize()
      );
      res.status(200).json(serializedFeedback);
    })
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

// as soon as page loads
router.post("/visited/:eventId", (req, res) => {
  console.log(req.params.eventId);
  EventModel.findByIdAndUpdate(req.params.eventId, {
    $push: { webFormVisits: Date.now() }
  })
    .then(event => {
      console.log(event);
      res.status(201);
    })
    .catch(err =>
      res.status(500).json({ message: "something went wrong on the server" })
    );
});

router.post("/:eventCode", (req, res) => {
  let feedbackInfo = {
    content: req.body.content,
    optIn: req.body.optIn,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    updates: req.body.updates,
    feedback: req.body.feedback,
    volunteer: req.body.volunteer,
    timeStamp: Date.now()
  };

  EventModel.findOne({ code: req.params.eventCode })
    .then(event => {
      if (!event._id) {
        return res.status(400).json({ message: "this event doesn't exist" });
      }
      feedbackInfo.eventId = event._id;
      return Feedback.create(feedbackInfo);
    })
    .then(feedback => {
      res.status(201).json(feedback);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "something Went wrong on the server" });
    });
});

router.put("/:feedbackId", (req, res) => {
  let toUpdate = {};
  const okToUpdate = [
    "content",
    "optIn",
    "name",
    "email",
    "phone",
    "updates",
    "feedback",
    "volunteer"
  ];
  okToUpdate.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Feedback.findByIdAndUpdate(req.params.feedbackId, { $set: toUpdate })
    .then(feedback => Feedback.findById(feedback._id))
    .then(updatedFeedback => res.status(200).json(updatedFeedback))
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

module.exports = { router };
