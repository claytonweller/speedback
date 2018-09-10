"use strict";

const twilio = require("twilio");
const express = require("express");
const bodyParser = require("body-parser");
const { Feedback } = require("../feedback/models");
const { EventModel } = require("../events/models");
const { TWILIO_AUTH_TOKEN, TWILIO_SID } = require("../config");

const router = express.Router();
const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
const twilioNumber = "+17207352944";

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  let wordArray = req.body.Body.split(" ");
  let eventCode = wordArray[0];
  let email = wordArray
    .filter(word => word.includes("@"))
    .filter(word => word.includes("."))[0];

  let feedbackInfo = {
    content: req.body.Body.replace(eventCode + " ", ""),
    optIn: false,
    name: "",
    email: email,
    phone: req.body.From,
    wantsUpdates: false,
    wantsContact: false,
    wantsVolunteer: false,
    source: "Text",
    timeStamp: Date.now()
  };

  EventModel.findOne({ code: eventCode.toUpperCase() })
    .then(event => {
      if (!event) {
        return Feedback.findOne({ phone: req.body.From }).sort({
          timeStamp: -1
        });
      }
      feedbackInfo.eventId = event._id;
      return Feedback.create(feedbackInfo);
    })
    .then(feedback => {
      if (!feedback) {
        client.messages.create({
          body:
            "Make sure to enter the CODE followed by a space at the beginning of your feedback.",
          to: req.body.From, // Text this number
          from: twilioNumber // From a valid Twilio number
        });
        return Promise.reject({
          reason: "MissingInfo",
          message: "No feedback with this phone number"
        });
      }
      if (email) {
        return Feedback.findByIdAndUpdate(feedback._id, {
          $set: { email: email, optIn: true }
        });
      }
      return feedback;
    })
    .then(feedback => {
      return EventModel.findById(feedback.eventId);
    })
    .then(event => {
      if (!email) {
        return client.messages.create({
          body: `Thanks for your feedback! If you'd like to help out at or attend future events by ${
            event.displayName
          } respond with your email.`,
          to: req.body.From, // Text this number
          from: twilioNumber // From a valid Twilio number
        });
      } else {
        return client.messages.create({
          body: event.thanks,
          to: req.body.From, // Text this number
          from: twilioNumber // From a valid Twilio number
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "something Went wrong on the server" });
    });
});

module.exports = { router };
