'use strict'

const express = require('express')

const app = express()
require('./lib/tasky-routes')(app)

const PORT = 3000

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})