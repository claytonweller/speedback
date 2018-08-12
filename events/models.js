const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  title: {type: String, default: 'Event Title'},
  thanks: {type: String, default: 'Thanks for coming to our event'},
  endTimeStamp: {type:Number, required:true},
  host: {type: String, default: ''},
  code: {type:String, required:true},
  phone: {type:Number, required:true},
  hostId: {type:String, required:true},
  timeStamp: Number
})

const Event = mongoose.model('Event', eventSchema, 'events')

module.exports = { Event }