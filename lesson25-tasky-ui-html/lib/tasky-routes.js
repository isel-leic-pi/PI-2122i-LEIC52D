'use strict'

const express = require('express')
const tasksRouter = require('./tasks-web-api')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const openapi = YAML.load('./openapi.yaml')

/**
 * @param {Express} app 
 */
module.exports = function(app) {
    app.use(express.json()) // => Parses HTTP request body and populates req.body
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