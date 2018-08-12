const express = require('express')
const router = express.Router()

const EventModel = require('./models')
const Host = require('../hosts/models')
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

router.post('/', (req, res) =>{
  
  let defaultEvent = {
    title:'Title',
    thanks:'Thank you for coming to our event!',
    endTimeStamp: Date.now(),
    code: Math.floor(Math.random() * 100).toString(),
    phone:1112223333,
    timeStamp: Date.now(),
  }
  console.log(req.body)
  Host.findById(req.body.hostId)
    .then(host => {
      defaultEvent['host'] = host.firstName + ' ' + host.lastName
      defaultEvent['hostId'] = host._id
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


module.exports = router