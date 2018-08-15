const express = require('express')
const router = express.Router()

const {Feedback} = require('./models')
const {EventModel} = require('../events/models')

router.use(express.json())


router.get('/:eventId', (req, res) => {
  
  Feedback
    .find({eventId:req.params.eventId})
    .then(feedback => res.status(200).json(feedback))
    .catch(err => res.status(500).json({message: 'Something went wrong on the server'}))
    
})

router.get('/:feedBackId', (req, res) =>{
  //May not need this
})

router.post('/', (req, res) =>{
  let defaultFeedback = {   
    content: '',
    optIn: false,
    name: '',
    email: '',
    phone: '',
    updates: false,
    feedback: false,
    volunteer: false,
    timeStamp: Date.now(),
    didAnything: false,
  }

  EventModel.findOne({code:req.body.eventCode})
    .then( event =>{
      if(!event._id){
       return res.status(400).json({message:'this event doesn\'t exist'})
      }
      defaultFeedback['eventId'] = event._id
      return Feedback.create(defaultFeedback)
    })
    .then(feedback => {
      res.status(201).json(feedback)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message:'something Went wrong on the server'})
    })

})

router.put('/:feedbackId', (req, res) => {
  
  let toUpdate = {}
  const okToUpdate = ['content', 'optIn', 'name', 'email', 'phone', 'updates', 'feedback', 'volunteer', 'didAnything']
  okToUpdate.forEach(field =>{
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })
  Feedback
    .findByIdAndUpdate(req.params.feedbackId, {$set:toUpdate})
    .then(feedback => Feedback.findById(feedback._id))
    .then(updatedFeedback => res.status(200).json(updatedFeedback))
    .catch(err => res.status(500).json({message: 'Something went wrong on the server'}))
    
})

router.delete('/:feedbackId', (req, res) =>{
  //Might not need this
})


module.exports = {router}