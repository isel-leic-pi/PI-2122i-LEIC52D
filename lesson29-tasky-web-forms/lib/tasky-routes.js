'use strict'

const express = require('express')
const tasksWebApi = require('./tasks-web-api')
const tasksWebApp = require('./tasks-web-app')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const openapi = YAML.load('./openapi.yaml')
const path = require('path')

/**
 * @param {Express} app 
 */
module.exports = function(app) {
    /**
     * Setup view engine
     */
    app.set('view engine', 'hbs')
    /*
     * Add routes 
     */
    app.use(express.json()) // => Parses HTTP request body and populates req.body
    app.use(express.static('public'))
    // app.get('/tasky.css', (req, res) => { res.sendFile(path.join(process.cwd(), './views/tasky.css')) })
    // app.get('/todo.jfif', (req, res) => { res.sendFile(path.join(process.cwd(), './views/todo.jfif')) })

    app.use('/', tasksWebApp)
    app.use('/api', tasksWebApi)
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