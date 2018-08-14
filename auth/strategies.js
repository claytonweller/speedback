'use strict';
const { Strategy: LocalStrategy} = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')

//GOING TO NEED TO MAKE MY MODELS BEFORE I CAN ACUTALLY TEST THIS
const Host = require('../hosts/models')
const { JWT_SECRET } = require('../config')

const localStrategy = new LocalStrategy((email, password, callback) =>{
  let host
  Host.findOne({email:email})
    .then(_host => {
      host = _host
      if(!host){
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect email or password'
        })
      }
      return host.validatePassword(password) 
    })
    .then(isValid => {
      if(!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect email or password'
        })
      }
      return callback(null, host);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err)
      }
      return callback(err, false)
    })
})

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
)

module.exports = { localStrategy, jwtStrategy }