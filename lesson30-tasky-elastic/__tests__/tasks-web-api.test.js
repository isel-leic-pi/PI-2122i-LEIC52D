'use strict'

const fetch = require('node-fetch')
const request = require('supertest')
const express = require('express')
const db = require('./../lib/tasks-in-elastic')
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
        db.insertTask('gamboa', 7, 'swim-mile', 'Achieve 1 mile swimming open water.'),
        db.insertTask('gamboa', 3, 'pi-workout', 'Complete the first workout of Web Dev course.'),
        db.insertTask('gamboa', 20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.'),
        db.insertTask('rambo', 4, 'room-manage', 'Manage all books and stuff in my room')
    ]
    return Promise.all(prms)
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

test('Get all tasks for username gamboa', () => {
    return request(app)
        .get('/api/users/gamboa/tasks')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(resp => {
            expect(resp.body.length).toBe(3)
        })
})

test('Get a single task for unknown username', () => {
    return request(app)
        .get('/api/users/YYYYYY/tasks/kjdgf')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(resp => {
            expect(resp).toSatisfyApiSpec()
            expect(resp.body.message).toBe('User not available for YYYYYY')
        })
})

test('Get a single task for username gamboa', () => {
    return db
        .getAll('gamboa')
        .then(tasks => {
            const all = tasks.filter(t => t.title.includes('swim'))
            if(all.length == 0) throw Error('Missing swim task!')
            return all[0]
        })
        .then(swim => request(app)
            .get(`/api/users/gamboa/tasks/${swim.id}`)
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
    return db
        .getAll('rambo')
        .then(tasks => {
            expect(tasks[0].title).toBe('room-manage')
            expect(tasks[0].description).toBe('Manage all books and stuff in my room')
            return request(app)
                .put(`/api/users/rambo/tasks/${tasks[0].id}`)
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