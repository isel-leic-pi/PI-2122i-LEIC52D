'use strict'

const express = require('express')
const app = express()
const tasksRouter = require('./lib/tasks-web-api')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const openapi = YAML.load('./openapi.yaml')

const PORT = 3000

app.use(express.json()) // => Parses HTTP request body and populate req.body
app.use('/', tasksRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})