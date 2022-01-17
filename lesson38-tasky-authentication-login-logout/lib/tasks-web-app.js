'use strict'

const express = require('express')
const router = express.Router()
const tasks = require('./tasks-in-mem')

router.use(checkAlert)
router.get('/', (req, res) => { res.render('index') })
router.get('/signup', getSignup)
router.put('/signup/:username', putSignup)
router.get('/users', getUsers)
router.use('/users/:username', checkAuthentication)
router.get('/users/:username/tasks', getUserTasks)
router.get('/users/:username/tasks/:id', getUserTaskDetails)
router.post('/users/:username/tasks', postUserTasks)

function checkAlert(req, res, next) {
    const alert = req.session.alert
    delete req.session.alert
    res.locals.alert = alert
    next()
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function checkAuthentication(req, res, next) {
    if(!req.user) {
        req.session.alert = {
            title: 'Accedd Forbiden!',
            message: 'You should login/signup first to access tasks features.',
            kind: 'danger'
        }
        return res.redirect('/signup')
    }
    if(req.user.username != req.params.username) {
        req.session.alert = {
            title: 'Accedd Forbiden!',
            message: 'You can only access your tasks. You cannot access other users!',
            kind: 'warning'
        }
        return res.redirect(req.headers.referer)
    }
    next()
}

function getSignup(req, res) {
    res.render('signup') 
}

function putSignup (req, res, next) {
    tasks
        .insertUser(req.params.username, req.body.pass)
        .then(() => tasks.getUser(req.params.username))
        .then(user => req.logIn(user, err => {
            if(err) return next(err)
            req.session.alert = {
                title: 'Signup Successfully!',
                message: req.params.username + ' has signned up with success!',
                kind: 'success'
            }    
            res.status(201).end()
        }))
        .catch(next)
}

function getUsers(req, res, next) {
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
}

function getUserTasks(req, res,next) {
    tasks
        .getAllTasks(req.params.username)
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
}

function getUserTaskDetails(req, res,next) {
    tasks
        .getTask(req.params.username, req.params.id)
        .then(task => {
            return res.render('taskDetails', task)
        })
        .catch(next)
}

function postUserTasks(req, res,next) {
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
}

module.exports = router