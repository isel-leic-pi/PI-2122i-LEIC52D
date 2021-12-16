'use strict'

const fetch = require('node-fetch')
let elasticUrl = 'http://localhost:9200/tasks'

module.exports = {
    setIndex,
    getUrl,
    getAll,
    getUsers,
    getTask,
    deleteTask,
    insertTask,
    updateTask
}

function setIndex(index) {
    elasticUrl = 'http://localhost:9200/' + index
}

function getUrl() {
    return elasticUrl
}

function getUsers() {
    return Promise.resolve('Not implemented!')
}

/**
 * @param {String} username
 * @returns {Promise.<Array.<Task>>}
 */
function getAll(username) {
    return fetch(elasticUrl + '/_search?q=username:' + username)
        .then(resp => checkStatus(200, resp))
        .then(resp => resp.json())
        .then(doc => {
            if(doc.hits.hits.length == 0)
                throw taskError(404, 'There is no User for username: ' + username)
            return doc.hits.hits.map(t => {
                t._source.id = t._id
                return t._source
            })
        })
    
}

function taskError(status, msg) {
    const err = new Error(msg)
    err.status = status
    return err
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
function getTask(username, id) {
    return fetch(elasticUrl + '/_doc/' + id)
        .then(resp => checkStatus(200, resp, 'No task with id ' + id))
        .then(resp => resp.json())
        .then(doc => {
            if(doc._source.username != username) 
                throw taskError(404, 'User not available for ' + username)
            doc._source.id = doc._id
            return doc._source
        })
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(username, id) {
    return fetch(elasticUrl + '/_doc/' + id + '?refresh=true', {
        method: 'delete'
    })
        .then(resp => checkStatus(200, resp, 'No task with id ' + id))
}

/**
 * @typedef Task
 * @type {Object}
 * @property {String} username Username of the task's owner.
 * @property {String} id Unique Id
 * @property {Date} dueDate Number of days to due task
 * @property {String} title 
 * @property {String} description
 */
/**
 * @param {String} username Username of the task's owner.
 * @param {Number} days Number of days to complete this task.
 * @param {String} title Title of this task.
 * @param {String} description Description of this task.
 * @returns {Task} New Task object.
 */
function newTask(username, days, title, description) {
    const dt = new Date()
    dt.setDate(dt.getDate() + days)
    return {
        username,
        dueDate: dt, 
        title, 
        description}
}

/**
 * @param {String} username
 * @param {Number} days Number of days to task due.
 * @param {String} title 
 * @param {String} descriptions
 * @returns {Promise.<Task>} Fulfilled with the new Task after save.
 */
function insertTask(username, days, title, description) {     
    const task = newTask(username, days, title, description)
    return fetch(elasticUrl + '/_doc?refresh=true', {
        method: 'post',
        body: JSON.stringify(task),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => checkStatus(201, resp))
        .then(resp => resp.json())
        .then(doc => {
            task.id = doc._id
            return task
        })
}

function checkStatus(status, resp, msg) {
    if(resp.status === status) return resp
    const err = msg 
        ? Error(msg)
        : Error(resp.statusText)
    err.status = resp.status
    throw err
}

/**
 * @param {String} username 
 * @param {String} id 
 * @param {Number} days 
 * @param {String} title 
 * @param {String} description 
 * @returns Promise<Task> with the already updated values
 */
function updateTask(username, id, days, title, description) {   
    const dt = days ? new Date() : undefined
    if(dt) dt.setDate(dt.getDate() + days)  
    return getTask(username, id)
        .then(task=>{
            task.title = title || task.title
            task.dueDate = dt || task.dueDate 
            task.description = description || task.description
            return task
        })
}
