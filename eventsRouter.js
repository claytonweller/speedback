const express = require('express')
const router = express.Router()

const { eventData } = require('./mock-data/eventData')
const { hostData } = require('./mock-data/hostData')
const { feedbackData } = require('./mock-data/feedbackData')
router.use(express.json())

router.get('/', (req, res) => {
  let selectedHost = hostData.filter(host => host.userName === req.body.hostId)[0]
  let hostEvents = eventData.filter(event => event.hostId === selectedHost.hostId)
  res.status(200).json(hostEvents)
})

router.get('/:eventId', (req, res) =>{
  let selectedEvent = eventData.filter(event => event.eventId === req.params.eventId)[0]
  selectedEvent['feedback'] = feedbackData.filter(feedback => feedback.eventId === req.params.eventId)
  res.status(200).json(selectedEvent)
})

router.post('/', (req, res) =>{
  let host = hostData.filter(host => host.userName === req.body.hostId)[0]
  let defaultEvent = {
    
    title:'Title',
    thanks:'Thank you for coming to our event!',
    endTimeStamp: Date.now(),
    host: host.firstName + ' ' + host.lastName,
    code: Math.floor(Math.random() * 100),
    eventId: Math.floor(Math.random() * 1000),
    phone:'###-###-####',
    hostId:host.hostId,
    timeStamp: Date.now(),
  }
  eventData.push(defaultEvent)
  res.status(201).json(defaultEvent)
})

router.put('/:eventId', (req, res) => {
  let toUpdate = eventData.filter(event => event.eventId === req.params.eventId)[0]
  const okToUpdate = ['title', 'thanks', 'endTimeStamp', 'host']
  okToUpdate.forEach(field =>{
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })
  res.status(200).json(toUpdate)
})

router.delete('/:eventId', (req, res) =>{
  let indexToDelete;
  for(var i = 0; i < eventData.length; i++) {
    if(eventData[i].eventId === req.params.eventId) {
      indexToDelete = i
    }
  } 
  if (indexToDelete || indexToDelete === 0) {
    eventData.splice(indexToDelete, 1);

  }
  res.status(204).end()
})


module.exports = router