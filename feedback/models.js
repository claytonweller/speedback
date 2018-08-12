const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
  content: {type: String, default: ''},
  optIn: {type: Boolean, default: false},
  name: {type: String, default: ''},
  email: {type: String, default: ''},
  phone: {type: String, default: ''},
  updates: {type: Boolean, default: false},
  feedback: {type: Boolean, default: false},
  volunteer: {type: Boolean, default: false},
  timeStamp: {type:Number, required:true},
  eventId: {type:String, required:true},
  didAnything: {type: Boolean, default: false},
})

const Feedback = mongoose.model('Event', feedbackSchema, 'events')

module.exports = { Feedback }