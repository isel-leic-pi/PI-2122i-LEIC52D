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
        .then(data => data.hits.hits.map(item => Object.keys(item._source)[0]))
}

/**
 * @param {String} username
 * @returns {Promise.<Array.<Task>>}
 */
function getAll(username) {
    return fetch(TASKS_URL + '_search')
        .then(res => res.json())
        .then(data => data.hits.hits.filter(item => 
            Object.keys(item._source)[0] === username))
        .then(arr => Object.values(arr[0]._source)[0])
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
function getTask(username, id) {
    return getAll(username)
        .then(tasks => tasks.filter(t => t.id === id))
        .then(tasks => { 
            if(tasks.length == 0) {
                const err = new Error('No task with id ' + id) 
                err.status = 404
                throw err
            }
            else return tasks[0]
        })
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(username, id) {
    return Promise.reject()
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
 * 
 * @param {Number} days Number of days to complete this task.
 * @param {String} title Title of this task.
 * @param {String} description Description of this task.
 * @returns {Task} New Task object.
 */
function newTask(days, title, description) {
    const dt = new Date()
    dt.setDate(dt.getDate() + days)
    return {
        id: Math.random().toString(36).substr(2), 
        dueDate: dt, 
        title, 
        description}
}

/**
 * @param {String} username
 * @param {Number} days Number of days to task due.
 * @param {String} title 
 * @param {String} descriptions
 * @returns {Promise.<Task>} Fulfills with the new Task after save.
 */
function insertTask(username, days, title, description) {     
    const task = new newTask(days, title, description)
    const userTasks = tasks[username]
    if(userTasks) {
        userTasks.push(task)
    } else {
        tasks[username] = [task]
    }
    return Promise.resolve(task)
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
