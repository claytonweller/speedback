const express = require('express')
const router = express.Router()

const { eventsData } = require('./mock-data/eventsData')
const { hostData } = require('./mock-data/hostData')
const { feedbackData } = require('./mock-data/feedbackData')
router.use(express.json())

router.get('/:host', (req, res) => {
  let selectedHost = hostData.filter(host => host.userName === req.params.host)[0]
  let hostEvents = eventsData.filter(event => event.hostId === selectedHost.hostId)
  res.status(200).json(hostEvents)
})

router.get('/:host/:id', (req, res) =>{
  let selectedEvent = eventsData.filter(event => event.eventId === req.params.id)[0]
  selectedEvent['feedback'] = feedbackData.filter(feedback => feedback.eventId === req.params.id)
  res.status(200).json(selectedEvent)
})


module.exports = router