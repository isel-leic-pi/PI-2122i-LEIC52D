'use strict'

const express = require('express')

const app = express()
require('./lib/tasky-routes')(app)

const PORT = 3000

insertDummies()
    .then(() => app.listen(PORT, () => {
        console.log('Listening on port ' + PORT)
    }))

function insertDummies() {
    const tasks = require('./lib/tasks-in-mem')
    const prms = [
        tasks.insertTask('gamboa', 7, 'swim-mile', 'Achieve 1 mile swimming open water.'),
        tasks.insertTask('gamboa', 3, 'pi-workout', 'Complete the first workout of Web Dev course.'),
        tasks.insertTask('gamboa', 20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.'),
        tasks.insertTask('muadib', 4, 'room-manage', 'Manage all books and stuff in my room')
    ]
    return Promise.all(prms)
}
