'use strict'

const router = require('express').Router()
const tasks = require('./tasks-in-mem')

router.put('/users/:username', (req, res, next) => {
    tasks
        .insertUser(req.params.username, req.body.pass)
        .then(() => tasks.getUser(req.params.username))
        .then(user => req.logIn(user, err => {
            if(err) next(err)
            else res.status(201).end()
        }))
        .catch(next)
})

router.get('/users/:username/tasks', (req, res, next) => {
    tasks
        .getAllTasks(req.params.username)
        .then(tasks => res.json(tasks))
        .catch(next)
})

router.get('/users/:username/tasks/:taskId', (req, res, next) => {
    tasks
        .getTask(req.params.username, req.params.taskId)
        .then(task => res.json(task))
        .catch(next)
})

router.delete('/users/:username/tasks/:taskId', (req, res, next) => {
    tasks
        .deleteTask(req.params.username, req.params.taskId)
        .then(() => res.json({
            message: `Task with id ${req.params.taskId} deleted!`
        }))
        .catch(next)
})

router.put('/users/:username/tasks/:taskId', (req, res, next) => {
    tasks
        .updateTask(
            req.params.username,
            req.params.taskId,
            req.body.days,
            req.body.title,
            req.body.description
        )
        .then(task => res.json(task))
        .catch(next)
})

module.exports = router