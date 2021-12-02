'use strict'

const express = require('express')
const tasksRouter = require('./tasks-web-api')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const openapi = YAML.load('./openapi.yaml')
const path = require('path')

/**
 * @param {Express} app 
 */
module.exports = function(app) {
    app.use(express.json()) // => Parses HTTP request body and populates req.body
    app.use(express.static('public'))
    // app.get('/tasky.css', (req, res) => { res.sendFile(path.join(process.cwd(), './views/tasky.css')) })
    // app.get('/todo.jfif', (req, res) => { res.sendFile(path.join(process.cwd(), './views/todo.jfif')) })

    app.get('/', (req, res) => {
        /*
         * Sets the Content-Type response HTTP header field based on the filename’s extension. 
         */
        res.sendFile(path.join(process.cwd(), './views/index.html'))
    })

    app.use(tasksRouter)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi))

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, resp, _next) => {
        resp
            .status(err.status || 500)
            .json({
                message: err.message
            }) 
    })
}