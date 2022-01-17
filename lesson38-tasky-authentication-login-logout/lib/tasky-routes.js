'use strict'

const express = require('express')
const passport = require('passport')

const tasks = require('./tasks-in-mem')
const tasksWebApi = require('./tasks-web-api')
const tasksWebApp = require('./tasks-web-app')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const openapi = YAML.load('./openapi.yaml')

/**
 * @param {Express} app 
 */
module.exports = function(app) {
    /**
     * Setup view engine
     */
    app.set('view engine', 'hbs')
    /*
     * Add Middleware 
     */
    app.use(express.json()) // => Parses HTTP request body and populates req.body
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.use(express.static('public'))
    app.use(require('cookie-parser')())
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => {
        done(null, user.username)
    })
    passport.deserializeUser((username, done) => {
        tasks
            .getUser(username)
            .then(user => done(null, user))
            .catch(err => done(err))
    })

    /**
     * Add Route Handlers
     */
    app.use('/api', tasksWebApi)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi))
    app.use('/', tasksWebApp)
    
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, resp, _next) => {
        resp
            .status(err.status || 500)
            .json({
                message: err.message
            }) 
    })
}