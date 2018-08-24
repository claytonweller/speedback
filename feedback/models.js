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
})

feedbackSchema.methods.serialize = function() {
  let preferences = []
  if(this.updates){
    preferences.push('Wants to know about future events')
  }
  if(this.feedback){
    preferences.push('Wants to talk directly to you')
  }
  if(this.volunteer){
    preferences.push('Wants to volunteer at future events')
  }

  console.log(preferences)
  
  return {
    content: this.content,
    optIn: this.optIn,
    name: this.name,
    email: this.email,
    phone: this.phone,
    preferences: preferences,
    timeStamp: this.feedback,
    eventId: this.eventId,
  };
};

const Feedback = mongoose.model('Feedback', feedbackSchema, 'feedback')

module.exports = {Feedback}