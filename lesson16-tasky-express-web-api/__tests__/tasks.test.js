'use strict'

const tasks = require('./../lib/tasks-db')
const fs = require('fs/promises')

function insertDummies() {
    const prms = [
        tasks.insertTask('gamboa', 7, 'swim-mile', 'Achieve 1 mile swimming open water.'),
        tasks.insertTask('gamboa', 3, 'pi-workout', 'Complete the first workout of Web Dev course.'),
        tasks.insertTask('gamboa', 20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.'),
        tasks.insertTask('rambo', 4, 'room-manage', 'Manage all books and stuff in my room')
    ]
    return Promise.all(prms)
}

const DATA_PATH = './__tests__/data/'

beforeAll(() => { 
    tasks.changePath(DATA_PATH)
    return fs
        .mkdir(DATA_PATH, { recursive: true }) // create folder if not exists
        .then(() => insertDummies())
})

afterAll(() => {
    return fs
        .readdir(DATA_PATH)
        .then(files => files.map(f => fs.unlink(DATA_PATH + f)))
        .then(prms => Promise.all(prms))
})

test('Get all tasks', () => {
    return Promise.all([
            tasks.getAll('gamboa'),
            tasks.getAll('rambo')
        ])
        .then(tasks => {
            tasks = tasks.flatMap(tasks => tasks)
            return expect(tasks.length).toBe(4)
        })
})

test('Get a single task for given username and ID', () => {
    return tasks
        .getAll('gamboa')
        .then(tasks => {
            const all = tasks.filter(t => t.title.includes('swim'))
            if(all.length == 0) throw Error('Missing swim task!')
            return all[0]
        })
        .then(swim => tasks.getTask('gamboa', swim.id))
        .then(tasks => expect(tasks.title).toBe('swim-mile'))
})

test('Get unkown task', () => {
    const taskId = 'nsflhqohr2'
    return tasks
        .getTask('gamboa', taskId)
        .then(tasks => { throw Error('Assertion failed. It should not succeed getting a task.') })
        .catch(err => expect(err.message).toBe('No task with id nsflhqohr2'))
})

test('Get unkown task for unkown user', () => {
    const taskId = 'nsflhqohr2'
    return tasks
        .getTask('muadib', taskId)
        .then(tasks => { throw Error('Assertion failed. It should not succeed getting a task.') })
        .catch(err => expect(err.message).toBe('No tasks for muadib'))
})

test('Crate and delete a task', async () => {
    const shoes = await tasks.insertTask('rambo', 3, 'run-shoes', 'Buy new running shoes')
    const all = await tasks.getAll('rambo')
    expect(all.length).toBe(2)
    const actual = await tasks.getTask('rambo', shoes.id)
    expect(actual.title).toBe('run-shoes')
    expect(actual.description).toBe('Buy new running shoes')
    await tasks.deleteTask('rambo', shoes.id)
    const allAfter = await tasks.getAll('rambo')
    expect(allAfter.length).toBe(1)
})