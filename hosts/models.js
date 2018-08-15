const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

mongoose.Promise = global.Promise

const hostSchema = mongoose.Schema({
  firstName: {type:String, required:true},
  lastName: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  password: {type:String, required:true}
})

hostSchema.methods.serialize = function(){
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    hostId: this._id
  }
}

hostSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password)
}

hostSchema.statics.hashPassword = function(password){
  return bcrypt.hash(password, 10)
}

const Host = mongoose.model('Host', hostSchema, 'hosts')

module.exports = {Host}