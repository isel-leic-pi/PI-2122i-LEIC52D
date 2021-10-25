'use strict'

const request = require('sync-request')

/**
 * 
 * @param {String} url 
 * @returns {Number} with the length of the body response.
 */
function getBodyLengthSync(url) {
    const resp = request('GET', url)
    const body = resp.getBody()
    return body.length
}

const urls = {
    'github': 'https://github.com/',
    'MDN': 'https://developer.mozilla.org/en-US/',
    'stackoverflow': 'https://stackoverflow.com/'
}

Object
    .keys(urls)
    .forEach(prop => {
        console.log('Request to ' + prop + '...')
        const size = getBodyLengthSync(urls[prop])
        console.log(prop + ' body response has length of ' + size)
    })

