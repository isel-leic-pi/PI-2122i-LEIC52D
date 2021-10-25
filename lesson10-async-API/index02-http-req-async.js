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

const urls = {
    'github': 'https://github.com/',
    'MDN': 'https://developer.mozilla.org/en-US/',
    'stackoverflow': 'https://stackoverflow.com/'
}

Object
    .keys(urls)
    .forEach(name => {
        console.log(`Requesting ${urls[name]}...`)
        getBodySize(urls[name])
            .then(size => console.log(`${name} size = ${size}`))
    })