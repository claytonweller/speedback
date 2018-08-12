const express = require('express')
const router = express.Router()


router.use(express.json())

const Host = require('./models')

router.get('/', (req, res) =>{
  let host = hostData.filter(host => host.hostId === req.params.id)
  res.status(200).json(host)
})

router.post('/', (req, res) =>{
  
  const requiredFields = ['firstName', 'lastName', 'password', 'email']
  const missingField = requiredFields.find(field => !(field in req.body))
  if(missingField){
    console.log('Missing Field')
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'missing field',
      location: missingField
    })
  }

  const stringFields = ['firstName', 'lastName', 'password', 'email']
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  )

  if (nonStringField) {
    console.log('nonStringField')
    return res.status(422).json({
      code: 422,
      reason:'ValicationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    })
  }

  const explicitlyTrimmedFields = ['email', 'password']
  const nonTrimmedField = explicitlyTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  )

  if (nonTrimmedField) {
    console.log('nonTrimmedField')
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    })
  }

  const sizedFields = {
    firstName:{
      min:1
    },
    lastName:{
      min:1
    },
    email:{
      min:5,
    },
    password:{
      min:10,
      max:72
    }
  }

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
  )

  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
  )

  if (tooSmallField || tooLargeField) {
    console.log('Field too small or too large')
    return res.status(422).json({
      code:422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargField
          
    })
  }

  let {email, password, firstName, lastName} = req.body
  firstName = firstName.trim()
  lastName = lastName.trim()

  return Host.find({email:email})
    .countDocuments()
    .then(count => {
      if(count > 0){
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already associated with an account',
          location:'email'
        })
      }
      return Host.hashPassword(password)
    })
    .then(hash => {
      return Host.create({
        email,
        password: hash,
        firstName,
        lastName
      })
    })
    .then(host => {
      return res.status(201).json(host.serialize())
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err)
      }
      res.status(500).json({code:500, message: 'Internal Server Error'})
    })
  
})

module.exports = router