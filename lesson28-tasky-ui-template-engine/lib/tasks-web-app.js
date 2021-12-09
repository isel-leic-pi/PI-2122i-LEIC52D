'use strict'

const router = require('express').Router()
const tasks = require('./tasks-in-mem')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/users', (req, res) => {
    tasks
        .getUsers()
        .then(users => {
            const model = users
                .map(name => { return {
                    'username': name, 
                    'path': `/users/${name}/tasks`
                }})
            return res.render('users', {'users': model})
        })
})

module.exports = router