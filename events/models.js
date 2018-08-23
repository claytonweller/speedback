// EVENT models

const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: { type: String, default: "Event Title" },
  thanks: { type: String, default: "Thanks for coming to our event" },
  endTimeStamp: { type: Number, required: true },
  displayName: { type: String, default: "" },
  host: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Host" },
  code: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  webFormVisits: { type: Array, default: [] },
  timeStamp: Number
});

eventSchema.methods.serialize = function() {
  return {
    title: this.title,
    thanks: this.thanks,
    endTimeStamp: this.endTimeStamp,
    displayName: this.displayName,
    code: this.code,
    phone: this.phone,
    host: this.host._id,
    timeStamp: this.timeStamp,
    eventId: this._id
  };
};

const EventModel = mongoose.model("Event", eventSchema, "events");

module.exports = { EventModel };
