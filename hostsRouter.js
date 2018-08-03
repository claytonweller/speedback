const express = require('express')
const router = express.Router()

const { eventData } = require('./mock-data/eventData')
const { hostData } = require('./mock-data/hostData')
const { feedbackData } = require('./mock-data/feedbackData')
router.use(express.json())

router.get('/', (req, res) => {
  res.status(200).json(eventData)
})

router.get('/:id', (req, res) =>{
  let selectedEvent = eventData.filter(event => event.eventId === req.params.id)[0]
  selectedEvent['feedback'] = feedbackData.filter(feedback => feedback.eventId === req.params.id)
  res.status(200).json(selectedEvent)
})

module.exports = router