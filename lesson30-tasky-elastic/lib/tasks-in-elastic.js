'use strict'

const fetch = require('node-fetch')

module.exports = {
    getAll,
    getUsers,
    getTask,
    deleteTask,
    insertTask,
    updateTask
}

/**
 * URL of tasks index in ElasticSearch database.
 */
const TASKS_URL = 'http://localhost:9200/tasks/'

/**
 * @returns Promise.<Array.<String>> Fullfiled with an array of string objects with the usernames
 */
function getUsers() {
    return fetch(TASKS_URL + '_search')
        .then(res => res.json())
        .then(data => data.hits.hits.map(item => item._source.username))
        .then(arr => [...new Set(arr)]) // remove repetitions
}

/**
 * @param {String} username
 * @returns {Promise.<Array.<Task>>}
 */
function getAll(username) {
    return fetch(TASKS_URL + '_search')
        .then(res => res.json())
        .then(data => 
            data.hits.hits.filter(item => item._source.username === username))
        .then(arr => arr.map(doc => {
            doc._source.id = doc._id // attach Id for each task
            return doc._source
        })) 
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
function getTask(username, id) {
    return fetch(TASKS_URL + '_doc/' + id)
        .then(res => { return res.status != 200
            ? res.json().then(() => { throw Error(res.statusText)})
            : res.json()
        })
        .then(doc => { 
            if(doc._source.username != username) {
                const err = new Error('No task for username ' + username)
                err.status = 404
                throw err
            }
            else {
                doc._source.id = doc._id // attach Id for each task
                return doc._source
            }
        })
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(username, id) {
    return getTask(username, id) // First check that task exists
        .then(() => fetch(TASKS_URL + '_doc/' + id + '?refresh=true', { method: 'delete'}))
}

/**
 * @typedef Task
 * @type {Object}
 * @property {String} id Unique Id
 * @property {Date} dueDate Date to due task.
 * @property {String} title 
 * @property {String} description
 */
/**
 * @param {String} username Username
 * @param {Number} days Number of days to complete this task.
 * @param {String} title Title of this task.
 * @param {String} description Description of this task.
 * @returns {Task} New Task object.
 */
function newTask(username, days, title, description) {
    const dt = new Date()
    dt.setDate(dt.getDate() + days)
    return {
        username: username,
        dueDate: dt,
        title,
        description
    }
}

/**
 * @param {String} username
 * @param {Number} days Number of days to task due.
 * @param {String} title 
 * @param {String} descriptions
 * @returns {Promise.<Task>} Fulfills with the new Task after save.
 */
function insertTask(username, days, title, description) {
    const task = new newTask(username, days, title, description)
    return fetch(TASKS_URL + '_doc' + '?refresh=true', {
        method: 'post',
        body: JSON.stringify(task),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => { return res.status != 201
            ? res.json().then(msg => { throw Error(msg.error)})
            : res.json()
        })
        .then(res => {
            task.id = res._id // Add generated _id to task.id
            return task
        })
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
    if (dt) dt.setDate(dt.getDate() + days)
    return getTask(username, id)
        .then(task => {
            task.title = title || task.title
            task.dueDate = dt || task.dueDate
            task.description = description || task.description
            return task
        })
        .then(task => fetch(TASKS_URL + '_doc/' + task.id + '?refresh=true', {
            method: 'PUT',
            body: JSON.stringify(task),
            headers: { 'Content-Type': 'application/json' },
        }))
        .then(() => getTask(username, id))
}
