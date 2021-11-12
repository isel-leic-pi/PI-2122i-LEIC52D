'use strict'

const express = require('express')
const app = express()
const tasksRouter = require('./lib/tasks-web-api')
const PORT = 3000

app.use('/', tasksRouter)

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})