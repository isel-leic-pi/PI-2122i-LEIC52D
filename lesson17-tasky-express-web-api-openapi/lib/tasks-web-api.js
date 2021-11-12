'use strict'

const router = require('express').Router()
const tasks = require('./tasks-db')

router.get('/users/:username/tasks', (req, res) => {
    tasks
        .getAll(req.params.username)
        .then(tasks => res.json(tasks))
})

router.get('/users/:username/tasks/:taskId', (req, res) => {
    tasks
        .getTask(req.params.username, req.params.taskId)
        .then(task => res.json(task))
})

router.delete('/users/:username/tasks/:taskId', (req, res) => {
    tasks
        .deleteTask(req.params.username, req.params.taskId)
        .then(() => res.json({
            message: `Task with id ${req.params.taskId} deleted!`
        }))
})

module.exports = router