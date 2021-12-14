'use strict'

const fetch = require('node-fetch')
const db = require('./../lib/tasks-in-elastic')
let tasks

function insertDummies() {
    const prms = [
        db.insertTask('luke', 7, 'swim-mile', 'Achieve 1 mile swimming open water.'),
        db.insertTask('luke', 3, 'pi-workout', 'Complete the first workout of Web Dev course.'),
        db.insertTask('luke', 20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.'),
        db.insertTask('vader', 4, 'room-manage', 'Manage all books and stuff in my room')
    ]
    return Promise.all(prms).then(ts => tasks = ts)
}

beforeAll(() => { 
    db.setIndex('tasks-test')
    /*
     * First drop and recreate test Index 
     */
    return fetch(db.getUrl(), { method: 'delete'})
        .then(() => fetch(db.getUrl(), { method: 'put' }))
        .then(data => insertDummies())
})


test('Get all tasks', () => {
    return Promise.all([
            db.getAll('luke'),
            db.getAll('vader')
        ])
        .then(tasks => {
            tasks = tasks.flatMap(tasks => tasks)
            return expect(tasks.length).toBe(4)
        })
})

test('Get a single task for given username and ID', () => {
    return db
        .getAll('luke')
        .then(arr => {
            const all = arr.filter(t => t.title.includes('swim'))
            if(all.length == 0) throw Error('Missing swim task!')
            return all[0]
        })
        .then(swim => db.getTask('luke', swim.id))
        .then(task => expect(task.title).toBe('swim-mile'))
})

test('Get unkown task', () => {
    const taskId = 'nsflhqohr2'
    return db
        .getTask('luke', taskId)
        .then(tasks => { throw Error('Assertion failed. It should not succeed getting a task.') })
        .catch(err => expect(err.message).toBe('Not Found'))
})

test('Get task for unkown user', () => {
    const taskId = tasks[0].id
    return db
        .getTask('jabba', taskId)
        .then(tasks => { throw Error('Assertion failed. It should not succeed getting a task.') })
        .catch(err => expect(err.message).toBe('No task for username jabba'))
})

test('Create and delete a task', async () => {
    const shoes = await db.insertTask('vader', 3, 'run-shoes', 'Buy new running shoes')
    const all = await db.getAll('vader')
    expect(all.length).toBe(2)
    const actual = await db.getTask('vader', shoes.id)
    expect(actual.title).toBe('run-shoes')
    expect(actual.description).toBe('Buy new running shoes')
    await db.deleteTask('vader', shoes.id)
    const allAfter = await db.getAll('vader')
    expect(allAfter.length).toBe(1)
})


test('Create and update a task', async () => {
    const test = await db.insertTask('pedro', 1, 'test', 'testing')
    const get = await db.getTask('pedro',test.id)
    expect(get.title).toBe('test')
    expect(get.description).toBe('testing')
    const updated = await db.updateTask('pedro',test.id,2,'testdone','tested')
    expect(updated.title).toBe('testdone')
    expect(updated.description).toBe('tested')
    const allAfter = await db.getAll('pedro')
    expect(allAfter.length).toBe(1)
    await db.deleteTask(test.username, test.id)
})