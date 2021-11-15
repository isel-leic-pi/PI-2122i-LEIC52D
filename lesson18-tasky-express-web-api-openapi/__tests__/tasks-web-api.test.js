'use strict'

const request = require('supertest')
const express = require('express')
const fs = require('fs/promises')
const tasks = require('./../lib/tasks-db')
const tasksRouter = require('./../lib/tasks-web-api')
const jestOpenAPI = require('jest-openapi').default

// Load an OpenAPI file (YAML or JSON) into this plugin
jestOpenAPI(process.cwd() +  '/openapi.yaml');

const app = express()
app.use(tasksRouter)

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

test('Get all tasks for username gamboa', () => {
    return request(app)
      .get('/users/gamboa/tasks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(resp => {
          expect(resp.body.length).toBe(3)
      })
})

test('Get a single task for unknown username', () => {
    return request(app)
      .get('/users/YYYYYY/tasks/kjdgf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then(resp => expect(resp.body.message).toBe('No tasks for YYYYYY'))
})


test('Get a single task for username gamboa', () => {
    return tasks
    .getAll('gamboa')
    .then(tasks => {
        const all = tasks.filter(t => t.title.includes('swim'))
        if(all.length == 0) throw Error('Missing swim task!')
        return all[0]
    })
    .then(swim => request(app)
        .get(`/users/gamboa/tasks/${swim.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200))
    .then(resp => {
        expect(resp.body.title).toBe('swim-mile')
        expect(resp.body.description).toBe('Achieve 1 mile swimming open water.')
        // Assert that the HTTP response satisfies the OpenAPI spec
        expect(resp).toSatisfyApiSpec()
        expect(resp.body).toSatisfySchemaInApiSpec('task')
    })
})