'use strict'

module.exports = {
    getAll,
    getUsers,
    getTask,
    deleteTask,
    insertTask,
    updateTask
}

/**
 * A container for tasks where the key is the username
 * and the value is an array of Task instances.
 */
const tasks = {}

function getUsers() {
    return Promise.resolve(Object.keys(tasks))
}

/**
 * @param {String} username
 * @returns {Promise.<Array.<Task>>}
 */
function getAll(username) {
    const userTasks = tasks[username]
    return !userTasks
        ? rejectPromise(404, 'There is no User for username: ' + username)
        : Promise.resolve(userTasks)
}

function rejectPromise(status, msg) {
    const err = new Error(msg)
    err.status = status
    return Promise.reject(err)
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
function getTask(username, id) {
    const userTasks = tasks[username]
    if(!userTasks) {
        return rejectPromise(404, 'User not available for ' + username)
    }    
    const ts = userTasks.filter(t => t.id == id)
    if(ts.length == 0) {
        return rejectPromise(404, 'No task with id ' + id) 
    }
    return Promise.resolve(ts[0])
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(username, id) {
    return getTask(username, id)
        .then(() => {
            const userTasks = tasks[username]
            tasks[username] = userTasks.filter(t => t.id != id)
        })
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
