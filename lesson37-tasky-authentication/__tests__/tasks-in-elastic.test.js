'use strict'

const fetch = require('node-fetch')
const tasks = require('./../lib/tasks-in-elastic')

function insertDummies() {
    const prms = [
        tasks.insertTask('luke', 7, 'swim-mile', 'Achieve 1 mile swimming open water.'),
        tasks.insertTask('luke', 3, 'pi-workout', 'Complete the first workout of Web Dev course.'),
        tasks.insertTask('luke', 20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.'),
        tasks.insertTask('vader', 4, 'room-manage', 'Manage all books and stuff in my room')
    ]
    return Promise.all(prms)
}

beforeAll(() => { 
    tasks.setIndex('tasks-test')
    /*
     * First drop and recreate test Index 
     */
    return fetch(tasks.getUrl(), { method: 'delete'})
        .then(() => fetch(tasks.getUrl(), { method: 'put' }))
        .then(data => insertDummies())
})

test('Create and delete a task', async () => {
    const shoes = await tasks.insertTask('vader', 3, 'run-shoes', 'Buy new running shoes')
    const actual = await tasks.getTask('vader', shoes.id)
    expect(actual.title).toBe('run-shoes')
    expect(actual.description).toBe('Buy new running shoes')
    await tasks.deleteTask('vader', shoes.id)
    const allAfter = await tasks.getAllTasks('vader')
    expect(allAfter.length).toBe(1)
})
