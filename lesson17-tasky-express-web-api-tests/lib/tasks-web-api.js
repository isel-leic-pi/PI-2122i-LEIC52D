'use strict'

const router = require('express').Router()
const tasks = require('./tasks-db')

router.get('/users/:username/tasks', (req, res, next) => {
    tasks
        .getAll(req.params.username)
        .then(tasks => res.json(tasks))
        .catch(next)
})

router.get('/users/:username/tasks/:taskId', (req, res, next) => {
    tasks
        .getTask(req.params.username, req.params.taskId)
        .then(task => res.json(task))
        .catch(next)
})

router.delete('/users/:username/tasks/:taskId', (req, res) => {
    tasks
        .deleteTask(req.params.username, req.params.taskId)
        .then(() => res.json({
            message: `Task with id ${req.params.taskId} deleted!`
        }))
        .catch(next)
})

router.use((err, req, resp, next) => {
   resp
    .status(err.status || 500)
    .json({
        message: err.message
    }) 
})

module.exports = router