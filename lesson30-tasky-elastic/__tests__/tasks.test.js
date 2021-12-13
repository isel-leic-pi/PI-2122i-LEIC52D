'use strict'

const tasks = require('./../lib/tasks-in-mem')

function insertDummies() {
    const prms = [
        tasks.insertTask('gamboa', 7, 'swim-mile', 'Achieve 1 mile swimming open water.'),
        tasks.insertTask('gamboa', 3, 'pi-workout', 'Complete the first workout of Web Dev course.'),
        tasks.insertTask('gamboa', 20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.'),
        tasks.insertTask('rambo', 4, 'room-manage', 'Manage all books and stuff in my room')
    ]
    return Promise.all(prms)
}

beforeAll(() => { 
    return insertDummies()
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
        .catch(err => expect(err.message).toBe('User not available for muadib'))
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

test('Crate and update a task', async () => {
    const test = await tasks.insertTask('pedro', 1, 'test', 'testing')
    const get = await tasks.getTask('pedro',test.id)
    expect(get.title).toBe('test')
    expect(get.description).toBe('testing')
    const updated = await tasks.updateTask('pedro',test.id,2,'testdone','tested')
    expect(updated.title).toBe('testdone')
    expect(updated.description).toBe('tested')
    const allAfter = await tasks.getAll('pedro')
    expect(allAfter.length).toBe(1)    
})