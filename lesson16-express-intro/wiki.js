'use strict'

const express = require('express')
const router = express.Router()

// Home page route
router.get('/', (req, res) => {
    res.send('Wiki home page')
})

// About page route
router.get('/about', (req, res) => {
    res.send('About this wiki')
})

module.exports = router
