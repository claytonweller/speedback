"use strict";

const accountSid = "AC3b2fdd2fad71352cd60d79458c966ac0"; // Your Account SID from www.twilio.com/console
const authToken = "467d1ad9c6cea7eb13e5be78a313c547"; // Your Auth Token from www.twilio.com/console

const twilio = require("twilio");
const express = require("express");
const bodyParser = require("body-parser");
const config = require("../config");

const router = express.Router();
const client = new twilio(accountSid, authToken);

// client.messages
//   .create({
//     body: "Hello from Node",
//     to: "+13038034589", // Text this number
//     from: "+17206969370" // From a valid Twilio number
//   })
//   .then(message => console.log(message.sid));

router.post("/", (req, res) => {
  console.log(req.body);
  res.json("GOOD");
  client.messages
    .create({
      body: "The Post worked!",
      to: "+13038034589", // Text this number
      from: "+17206969370" // From a valid Twilio number
    })
    .then(message => console.log(message.sid));
});

module.exports = { router };
