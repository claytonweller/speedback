require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config')
const app = express()

const eventsRouter = require('./events/router')
const hostsRouter = require('./hosts/router')
const feedbackRouter = require('./feedback/router')
const authRouter = require('./auth/router')
const { localStrategy, jwtStrategy } = require('./auth')


app.use(express.static('public'))
app.use(morgan('common'))
app.use('/events', eventsRouter)
app.use('/hosts', hostsRouter)
app.use('/feedback', feedbackRouter)
app.use('/auth', authRouter)

app.engine('html', require('ejs').renderFile);

// Need to import these two.
passport.use(localStrategy)
passport.use(jwtStrategy)

app.get('/:eventCode', (req, res)=>{
  res.status(200).render('../public/feedback.html')
})

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' })
})

let server;
  
function runServer (databaseUrl, port) {
  return new Promise((resolve, reject)=>{
    mongoose.connect(databaseUrl, {useNewUrlParser: true}, err => {
      if(err) {
        return reject(err)
      }
      server = app.listen(port, () =>{
        console.log(`listening at port ${port}`)
        resolve()
      })
      .on('error', err => {
        mongoose.disconnect()
        reject(err)
      })
    })
  })
}

const closeServer = () => {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject)=>{
      console.log('Closing Server')
      server.close(err =>{
        if(err){
          return reject(err)
        }
        resolve()
      })
    })    
  })

}

if (require.main === module) {
  runServer(DATABASE_URL, PORT).catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer}