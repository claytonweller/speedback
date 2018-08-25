const express = require("express");
const router = express.Router();
const passport = require("passport");

const { EventModel } = require("./models");
const { jwtStrategy } = require("../auth");

router.use(express.json());
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate("jwt", { session: false });

// GETS all of the events for a single host
router.get("/", jwtAuth, (req, res) => {
  return EventModel.find({ host: req.user.hostId })
    .then(events => {
      let serializedEvents = events.map(event => event.serialize());
      res.status(200).json(serializedEvents);
    })
    .catch(err => {
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

// GETS the event info to populate a feedback form
router.get("/code/:eventCode", (req, res) => {
  EventModel.findOne({ code: req.params.eventCode })
    .then(event => {
      res.status(200).json(event.serialize());
    })
    .catch(err => {
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

// Gets the event info for a single event
router.get("/:eventId", jwtAuth, (req, res) => {
  EventModel.findById(req.params.eventId)
    .then(event => {
      if (String(event.host) !== req.user.hostId) {
        return res
          .status(400)
          .json({ message: "You do not have access to this event" });
      }
      res.status(200).json(event.serialize());
    })
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

const generateEventCode = length => {
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // TODO: Check this, might crash
  let code = "";
  for (let index = 0; index < length; index++) {
    code = code + alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};

router.post("/", jwtAuth, (req, res) => {
  let eventInfo = {
    title: req.body.title,
    thanks: req.body.thanks,
    endTimeStamp: req.body.endTimeStamp,
    // TODO UTC ? FIX
    timeStamp: Date.now(),
    phone: "1234567890",
    webFormVisits: [],
    code: generateEventCode(3),
    displayName: req.body.displayName,
    host: req.user.hostId
  };
  // TODO LOOP generate eventcode promise loop
  EventModel.find({ code: eventInfo.code })
    .countDocuments()
    .then(count => {
      if (count) {
        // with 4 digits there are nearly half a million combinations
        eventInfo.code = generateEventCode(3);
      }
      return eventInfo;
    })
    .then(event => EventModel.create(event))
    .then(event => {
      res.status(201).json(event.serialize());
    });
});

router.put("/:eventId", jwtAuth, (req, res) => {
  let toUpdate = {};
  const okToUpdate = ["title", "thanks", "endTimeStamp", "displayName"];

  okToUpdate.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  EventModel.findById(req.params.eventId)
    .then(event => {
      if (String(event.host) !== req.user.hostId) {
        return res
          .status(400)
          .json({ message: "You do not have access to this event" });
      }
      return EventModel.findByIdAndUpdate(req.params.eventId, {
        $set: toUpdate
      });
    })
    .then(event => EventModel.findById(event._id))
    .then(updatedEvent => res.status(200).json(updatedEvent))
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

router.delete("/:eventId", jwtAuth, (req, res) => {
  EventModel.findById(req.params.eventId)
    .then(event => {
      if (String(event.host) !== req.user.hostId) {
        return res
          .status(400)
          .json({ message: "You do not have access to this event" });
      }
      console.log("Deleted event " + req.params.eventId);
      return EventModel.findByIdAndRemove(req.params.eventId);
    })
    .then(event => res.sendStatus(204).end())
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

module.exports = { router };
