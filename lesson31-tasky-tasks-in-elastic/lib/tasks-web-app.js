'use strict'

const router = require('express').Router()
const tasks = require('./tasks-in-mem')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/users', (req, res, next) => {
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
        .catch(next)
})

router.get('/users/:username/tasks', (req, res,next) => {
    tasks
        .getAll(req.params.username)
        .then(tasks => {
            tasks = tasks.map(t => { return {
                'id': t.id,
                'title': t.title,
                'description': t.description,
                'dueDate': new Intl.DateTimeFormat('pt-PT').format(t.dueDate)
            }})
            return res.render('tasks', {'tasks': tasks})
        })
        .catch(next)
})


router.get('/users/:username/tasks/:id', (req, res,next) => {
    tasks
        .getTask(req.params.username, req.params.id)
        .then(task => {
            return res.render('taskDetails', task)
        })
        .catch(next)
})

router.post('/users/:username/tasks', (req, res,next) => {
    const dueDate = req.body.dueDate // string
    const days = Math.ceil((new Date(dueDate) - Date.now()) / (24*60*60*1000))
    tasks
        .insertTask(req.params.username, days,req.body.title, req.body.desc)
        // .then(task => res.render('taskDetails', task)) // ERRADO
        .then(task => res
            .setHeader('Location', `/users/${req.params.username}/tasks/${task.id}`)
            .status(302)
            .end())
        // <=> .then(task => res.redirect(`/users/${req.params.username}/tasks/${task.id}`)
        .catch(next)
})

module.exports = router