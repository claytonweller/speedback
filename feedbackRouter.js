const express = require('express')
const router = express.Router()

const { eventData } = require('./mock-data/eventData')
const { hostData } = require('./mock-data/hostData')
const { feedbackData } = require('./mock-data/feedbackData')
router.use(express.json())

router.get('/', (req, res) => {
  //May not need this
})

router.get('/:feedBackId', (req, res) =>{
  //May not need this
})

router.post('/', (req, res) =>{
  let event = eventData.filter(event => event.code == req.body.eventCode)[0]
  let defaultComment = {   
    content: '',
    optIn: false,
    name: '',
    email: '',
    phone: '',
    updates: false,
    feedback: false,
    volunteer: false,
    timeStamp: Date.now(),
    eventId: event.eventId,
    feedbackId: Math.floor(Math.random()*10000).toString(),
    didAnything: false,
  }
  feedbackData.push(defaultComment)
  res.status(201).json(defaultComment)
})

router.put('/:feedbackId', (req, res) => {
  
  let toUpdate = feedbackData.filter(feedback => feedback.feedbackId === req.params.feedbackId)[0]
  const okToUpdate = ['content', 'optIn', 'name', 'email', 'phone', 'updates', 'feedback', 'volunteer', 'didAnything']
  okToUpdate.forEach(field =>{
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })
  res.status(200).json(toUpdate)
})

router.delete('/:feedbackId', (req, res) =>{

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