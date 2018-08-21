// EVENT models

const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: { type: String, default: "Event Title" },
  thanks: { type: String, default: "Thanks for coming to our event" },
  endTimeStamp: { type: Number, required: true },
  organizerDisplayName: { type: String, default: "" }, // RENAME THIS! to organizerDisplayName
  host: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Host" },
  code: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  visits: { type: Array, default: [] },
  timeStamp: Number
});

eventSchema.methods.serialize = function() {
  return {
    title: this.title,
    thanks: this.thanks,
    endTimeStamp: this.endTimeStamp,
    host: this.host,
    code: this.code,
    phone: this.phone,
    hostId: this.hostId,
    timeStamp: this.timeStamp,
    eventId: this._id
  };
};

const EventModel = mongoose.model("Event", eventSchema, "events");

module.exports = { EventModel };
