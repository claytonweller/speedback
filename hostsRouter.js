const express = require('express')
const router = express.Router()

const { eventData } = require('./mock-data/eventData')
const { hostData } = require('./mock-data/hostData')
const { feedbackData } = require('./mock-data/feedbackData')
router.use(express.json())

router.get('/', (req, res) => {
  //
})

router.get('/:id', (req, res) =>{
  //
})

module.exports = router