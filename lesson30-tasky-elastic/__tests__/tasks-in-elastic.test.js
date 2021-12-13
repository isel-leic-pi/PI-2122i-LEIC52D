'use strict'

const tasks = require('./../lib/tasks-in-elastic')

test('Get all Users', () => {
    return tasks
        .getUsers()
        .then(users => {
            expect(users.length).toBe(2)
            expect(users.filter(u => u === 'gamboa').length).toBe(1)
            expect(users.filter(u => u === 'rambo').length).toBe(1)
        })
})

test('Get all Tasks', () => {
    return tasks
        .getAll('gamboa')
        .then(tasks => {
            expect(tasks.length).toBe(2)
            expect(tasks[0].title).toBe('swim-mile')
        })
})
