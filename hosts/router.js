const express = require('express')
const router = express.Router()

const { eventData } = require('../mock-data/eventData')
const { hostData } = require('../mock-data/hostData')
const { feedbackData } = require('../mock-data/feedbackData')
router.use(express.json())


router.get('/', (req, res) =>{
  let host = hostData.filter(host => host.hostId === req.params.id)
  res.status(200).json(host)
})

router.post('/', (req, res) =>{
  console.log(req.body)
})

module.exports = router