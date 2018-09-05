const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  content: { type: String, default: "" },
  optIn: { type: Boolean, default: false },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  wantsUpdates: { type: Boolean, default: false },
  wantsContact: { type: Boolean, default: false },
  wantsVolunteer: { type: Boolean, default: false },
  timeStamp: { type: Number, required: true },
  eventId: { type: String, required: true }
});

feedbackSchema.methods.serialize = function() {
  let preferences = [];
  if (this.wantsUpdates) {
    preferences.push("Wants to know about future events");
  }
  if (this.wantsContact) {
    preferences.push("Wants to talk directly to you");
  }
  if (this.wantsVolunteer) {
    preferences.push("Wants to volunteer at future events");
  }

  return {
    content: this.content,
    optIn: this.optIn,
    name: this.name,
    email: this.email,
    phone: this.phone,
    preferences: preferences,
    timeStamp: this.timeStamp,
    eventId: this.eventId,
    id: this._id
  };
};

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");

module.exports = { Feedback };
