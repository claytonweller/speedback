const express = require('express')
const app = express()

let port = process.env.PORT || 8080
app.use(express.static('public'))
app.listen(port, () => console.log(`listening at port ${port}`))