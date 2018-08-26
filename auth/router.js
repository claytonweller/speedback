"use strict";
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const config = require("../config");
const router = express.Router();

const createAuthToken = function(host) {
  return jwt.sign({ host }, config.JWT_SECRET, {
    subject: String(host.hostId),
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

const localAuth = passport.authenticate("local", { session: false });
router.use(bodyParser.json());

router.post("/login", localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken, hostId: req.user._id });
});

const jwtAuth = passport.authenticate("jwt", { session: false });

router.post("/refresh", jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router, createAuthToken };
