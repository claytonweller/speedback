const express = require('express')
const morgan = require('morgan')

const PORT = process.env.PORT || 8080
const app = express()

const eventsRouter = require('./eventsRouter')
const hostsRouter = require('./hostsRouter')
const feedbackRouter = require('./feedbackRouter')

app.use(express.static('public'))
app.use(morgan('common'))
app.use('/events', eventsRouter)
app.use('/hosts', hostsRouter)
app.use('/feedback', feedbackRouter)

app.engine('html', require('ejs').renderFile);

app.get('/:eventCode', (req, res)=>{
  res.status(200).render('../public/feedback.html')
})

let server;

function runServer (port=PORT) {
  return new Promise((resolve, reject)=>{

    server = app.listen(port, () =>{
      console.log(`listening at port ${port}`)
      resolve()
    })
    .on('error', err => reject(err))
  })
}

const closeServer = () => {
  return new Promise((resolve, reject)=>{
    server.close(err =>{
      if(err){
        reject(err)
        return
      }
      console.log('Closing Server')
      resolve()
    })
  })
}

if (require.main === module) {
  runServer().catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer}