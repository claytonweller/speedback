"use strict";
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost:27017/speedback";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
exports.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
exports.TWILIO_SID = process.env.TWILIO_SID;
