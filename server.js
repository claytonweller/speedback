const express = require('express')
const morgan = require('morgan')

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.static('public'))
app.use(morgan('common'))

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