'use strict'

const request = require('supertest')
const express = require('express')
const tasks = require('./../lib/tasks-in-mem')
const jestOpenAPI = require('jest-openapi').default

// Load an OpenAPI file (YAML or JSON) into this plugin
jestOpenAPI(process.cwd() +  '/openapi.yaml')

/**
 * Setup express instance and routes
 */
const app = express()
require('./../lib/tasky-routes')(app)

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
        .then(resp => {
            expect(resp).toSatisfyApiSpec()
            expect(resp.body.message).toBe('User not available for YYYYYY')
        })
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
        // Assert that the HTTP response satisfies the OpenAPI spec
            expect(resp).toSatisfyApiSpec()
            expect(resp.body).toSatisfySchemaInApiSpec('task')
            // Assert content
            expect(resp.body.title).toBe('swim-mile')
            expect(resp.body.description).toBe('Achieve 1 mile swimming open water.')
        })
})

test('Updates a task for username rambo', () => {
    return tasks
        .getAll('rambo')
        .then(tasks => {
            expect(tasks[0].title).toBe('room-manage')
            expect(tasks[0].description).toBe('Manage all books and stuff in my room')
            return request(app)
                .put(`/users/rambo/tasks/${tasks[0].id}`)
                .send({title: 'blabla', description: 'say bla bla'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
        })
        .then(resp => {
        // Assert that the HTTP response satisfies the OpenAPI spec
            expect(resp).toSatisfyApiSpec()
            expect(resp.body).toSatisfySchemaInApiSpec('task')
            // Assert content
            expect(resp.body.title).toBe('blabla')
            expect(resp.body.description).toBe('say bla bla')
        })
})