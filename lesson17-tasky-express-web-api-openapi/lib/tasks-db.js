'use strict'

const fs = require('fs/promises')

const DEFAULT_PATH = './data/'

let dataPath = DEFAULT_PATH

module.exports = {
    changePath,
    getAll,
    getTask,
    deleteTask,
    insertTask,
    updateTask
}

/**
 * @param {String} p New path to store tasks files.
 */
function changePath(p) {
    dataPath = p
}

/**
 * @param {String} username
 * @returns {Promise.<Array.<Task>>}
 */
function getAll(username) {
    return fs
        .readdir(dataPath)
        .then(files => Promise.all(files
            .filter(f => f.includes(username))
            .map(f => readTask(f))))
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
function getTask(username, id) {
    return fs
        .readdir(dataPath)
        .then(files => readTask(findTask(files, username, id)))
}

/**
 * @param {Array<String>} files
 * @param {String} username
 * @param {String} id Task id
 * @returns String
 */
function findTask(files, username, id) {
    files = files.filter(f => f.includes(username))
    if(files.length == 0) throw Error('No tasks for ' + username) 
    files = files.filter(f => f.includes(id))
    if(files.length == 0) throw Error('No task with id ' + id) 
    return files[0]
}

/**
 * @param {String} file 
 * @returns {Task} instance representing a Task
 */
function readTask(file) {
    return fs
        .readFile(dataPath + file)
        .then(data => {
            const task = JSON.parse(data)
            task.dueDate = new Date(task.dueDate)
            return task
        })
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(username, id) {
    return fs
        .readdir(dataPath)
        .then(files => files.filter(f => f.includes(id)))
        .then(files => fs.unlink(dataPath + findTask(files, username, id)))
}

/**
 * @typedef Task
 * @type {Object}
 * @property {String} id Unique Id
 * @property {Date} dueDate Number of days to due task
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
 * @returns {Promise.<Task>} Fulfills with the new Task after save on disk.
 */
function insertTask(username, days, title, description) {     
    const task = new newTask(days, title, description)
    const file = `task-${username}-${task.id}-${task.title}.json`
    return fs
        .writeFile(dataPath + file, JSON.stringify(task))
        .then(() => task)
}

/**
 * @param {String} username 
 * @param {String} id 
 * @param {Number} days 
 * @param {String} title 
 * @param {String} description 
 * @returns Promise<Task> with the already updated values
 */
 function updateTask(username, id,days, title, description) {   
    const dt = new Date()
    dt.setDate(dt.getDate() + days)  
    return getTask(username,id)
        .then(task=>{
            const file = `task-${username}-${task.id}-${task.title}.json`
            task.title=title
            task.dueDate=dt, 
            task.description=description
            return fs
                .writeFile(dataPath + file, JSON.stringify(task))
                .then(() => task)
        })
}
