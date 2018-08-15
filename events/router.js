const express = require('express')
const router = express.Router()

const {EventModel} = require('./models')
const {Host} = require('../hosts/models')
router.use(express.json())

router.get('/', (req, res) => {
  
  if(req.query.hostId){
    return EventModel.find({hostId: req.query.hostId})
      .then(events => {
        let serializedEvents = events.map(event => event.serialize())
        res.status(200).json(serializedEvents)
      })
      .catch(err =>{
        res.status(500).json({message:'Something went wrong on the server'})
      })
  } if(req.query.eventCode) { 
    return EventModel.findOne({code: req.query.eventCode})
      .then(event => {
        res.status(200).json(event.serialize())
      })
      .catch(events =>{
        res.status(500).json({message:'Something went wrong on the server'})
      })
  } else {
    res.status(400).json({message:'No Events matching these parameters'})
  }
})

router.get('/:eventId', (req, res) =>{
  EventModel.findById(req.params.eventId)
    .then(event => res.status(200).json(event.serialize()))
    .catch(err => res.status(500).json({message: 'Something went wrong on the server'}))
})



const generateEventCode = (length) =>{
  let alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let code = ''
  for (let index = 0; index < length; index++) {
    code = code + alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}


router.post('/', (req, res) =>{
  let defaultEvent = {
    title:'Title',
    thanks:'Thank you for coming to our event!',
    endTimeStamp: Date.now(),
    // With 3 digits there are 17,576 possible codes
    code: generateEventCode(3),
    phone:1112223333,
    timeStamp: Date.now(),
  }
  Host.findById(req.body.hostId)
    .then(host => {
      defaultEvent['host'] = host.firstName + ' ' + host.lastName
      defaultEvent['hostId'] = host._id
      return EventModel.find({code:defaultEvent.code}).countDocuments()
    })
    .then(count => {
      if(count){  
        // with 4 digits there are nearly half a million combinations
        defaultEvent['code'] = generateEventCode(4)     
      }
      return defaultEvent
    })
    .then(event => EventModel.create(event))
    .then(event => {
      res.status(201).json(event.serialize())
    })

})

router.put('/:eventId', (req, res) => {
  let toUpdate={}
  const okToUpdate = ['title', 'thanks', 'endTimeStamp', 'host']
  
  okToUpdate.forEach(field =>{
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })    
  EventModel
    .findByIdAndUpdate(req.params.eventId, {$set: toUpdate})
    .then(event=> EventModel.findById(event._id))
    .then(updatedEvent => res.status(200).json(updatedEvent))
    .catch(err => res.status(500).json({message: 'Something went wrong on the server'}))
})  

router.delete('/:eventId', (req, res) =>{
  console.log('Deleted event '+ req.params.eventId)
  EventModel.findByIdAndRemove(req.params.eventId)
    .then(event => res.sendStatus(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong on the server'}))
})


module.exports = {router}