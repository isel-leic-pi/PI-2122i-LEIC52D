'use strict'

const express = require('express')
const router = express.Router()
const tasks = require('./tasks-in-mem')

router.use(checkLocals)
router.get('/', (req, res) => { res.render('index') })
router.get('/signup', getSignup)
router.put('/signup/:username', putSignup)
router.post('/login', postLogin)
router.post('/logout', postLogout)
router.get('/users', getUsers)
router.use('/users/:username', checkAuthentication)
router.get('/users/:username/tasks', getUserTasks)
router.get('/users/:username/tasks/:id', getUserTaskDetails)
router.post('/users/:username/tasks', postUserTasks)

function sessionAlert(session, kind, title, message) {
    session.alert = {
        title,
        message,
        kind
    }
}

function checkLocals(req, res, next) {
    if(req.session.alert) {
        const alert = req.session.alert
        delete req.session.alert
        res.locals.alert = alert    
    }
    if(req.user) {
        res.locals.user = req.user
    }
    next()
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function checkAuthentication(req, res, next) {
    if(!req.user) {
        sessionAlert(req.session, 'danger', 'Accedd Forbiden!', 'You should login/signup first to access tasks features.')
        return res.redirect('/signup')
    }
    if(req.user.username != req.params.username) {
        sessionAlert(req.session, 'warning', 'Accedd Forbiden!', 'You can only access your tasks. You cannot access other users!')
        return res.redirect(req.headers.referer)
    }
    next()
}

function getSignup(req, res) {
    res.render('signup') 
}
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function postLogout(req, res) {
    req.logout() // Remove user from session
    sessionAlert(req.session, 'success', 'Logged out', 'User logged out with success!')
    res.redirect(req.headers.referer)
}
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function postLogin(req, res, next) {
    tasks
        .getUser(req.body.username)
        .then(user => {
            if(user.password != req.body.password) {
                sessionAlert(req.session, 'danger', 'Bad Credentials!', 'Username or password incorrect!')
                res.status(409)
                res.statusMessage = 'Bad Credentials'
                res.end()
            } else {
                req.logIn(user, err => {
                    if(err) return next(err)
                    sessionAlert(req.session, 'success', 'Logged in!', req.body.username + ' has logged in with success!')
                    res.status(201).end()
                })
            }
        })
        .catch(next)
}

function putSignup (req, res, next) {
    tasks
        .insertUser(req.params.username, req.body.pass)
        .then(() => tasks.getUser(req.params.username))
        .then(user => req.logIn(user, err => {
            if(err) return next(err)
            sessionAlert(req.session, 'success', 'Signup Successfully!', req.params.username + ' has signned up with success!')
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