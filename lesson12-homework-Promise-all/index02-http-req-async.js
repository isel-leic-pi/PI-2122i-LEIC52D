'use strict'

const fetch = require('node-fetch')

/**
 * @param {String} url Path to make the HTTP request
 * @returns {Promise.<Number>} The size of the body response
 */
function getBodySize(url) {
    return fetch(url)              // Promise<Response>
        .then(res => res.text())   // Promise<Promise<String>>
        .then(body => body.length) // Promise<Number>
}

/**
 * @param  {...any} urls 
 * @returns {Promise.<Number>} Sum of the response bodies' lengths for given `urls`
 */
function sumBodiesSizes_NOT_SCALING(...urls) {
    return urls
        .reduce((accumulatorPromise, url) => accumulatorPromise
            .then((data) => {
                console.log(`Requesting ${url}...`)
                return getBodySize(url)
                    .then((size) => {
                        console.log(`====> Response from ${url} = ${size}`)
                        return data += size
                    })
            })
        , Promise.resolve(0))
}

/**
 * @param  {...any} urls 
 * @returns {Promise.<Number>} Sum of the response bodies' lengths for given `urls`
 */
function sumBodiesSizes(...urls) {
    return urls // array<string>
        .map(url => {
            console.log(`Requesting ${url}...`)
            return getBodySize(url)
        })      // array<promise>
        .reduce((accumulatorPromise, curr) => accumulatorPromise
            .then(data => curr
                .then((size) => {
                    console.log(`====> Response size = ${size}`)
                    return data += size
                }))
        , Promise.resolve(0))
}

/**
 * @param  {...String} urls 
 * @returns {Promise.<Number>} Sum of the response bodies' lengths for given `urls`
 */
function sumBodiesSizesViaPromiseAll(...urls) {
    const prms = urls 
        .map(url => {
            console.log(`Requesting ${url}...`)
            return getBodySize(url)
        })
    return Promise
        .all(prms)
        .then(sizes => sizes.reduce((p, c) => p + c))
}

const urls = {
    'github': 'https://github.com/',
    'MDN': 'https://developer.mozilla.org/en-US/',
    'stackoverflow': 'https://stackoverflow.com/'
}

function testGetBodySize() {
    Object
        .keys(urls)
        .forEach(name => {
            console.log(`Requesting ${urls[name]}...`)
            getBodySize(urls[name])
                .then(size => console.log(`${name} size = ${size}`))
        })
}

sumBodiesSizesViaPromiseAll(...Object.values(urls)) // <=> urls[0], urls[1], urls[2]
    .then(sum => console.log(`SUM = ${sum}`))