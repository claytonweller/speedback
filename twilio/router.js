"use strict";

const accountSid = "AC3b2fdd2fad71352cd60d79458c966ac0"; // Your Account SID from www.twilio.com/console
const authToken = "467d1ad9c6cea7eb13e5be78a313c547"; // Your Auth Token from www.twilio.com/console

const twilio = require("twilio");
const express = require("express");
const bodyParser = require("body-parser");
const { Feedback } = require("../feedback/models");
const { EventModel } = require("../events/models");
const config = require("../config");

const router = express.Router();
const client = new twilio(accountSid, authToken);

router.use(express.json());
router.use(bodyParser({ extended: false }));

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

  EventModel.findOne({ code: eventCode })
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
          from: "+17206969370" // From a valid Twilio number
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
          from: "+17206969370" // From a valid Twilio number
        });
      } else {
        return client.messages.create({
          body: event.thanks,
          to: req.body.From, // Text this number
          from: "+17206969370" // From a valid Twilio number
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "something Went wrong on the server" });
    });
});

module.exports = { router };
