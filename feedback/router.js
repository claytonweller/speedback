const express = require("express");
const router = express.Router();

const { Feedback } = require("./models");
const { EventModel } = require("../events/models");

router.use(express.json());

router.get("/:eventId", (req, res) => {
  Feedback.find({ eventId: req.params.eventId })
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

router.get("/:feedBackId", (req, res) => {
  //May not need this
});

// as soon as page loads
router.post("/visited/:eventId", (req, res) => {
  EventModel.findByIdAndUpdate(
    req.params.eventId,
    // TODO UTC Fix
    { $push: { webFormVisits: Date.now() } }
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
    // TODO UTC fix
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

router.delete("/:feedbackId", (req, res) => {
  //Might not need this
});

module.exports = { router };
