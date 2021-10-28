'use strict'

const fetch = require('node-fetch')

/**
 * @param {String} url Path to make the HTTP request
 * @returns {Promise.<Number>} The size of the body response
 */
async function getBodySize(url) {
    const prm = fetch(url)        // Promise<Response>
    const res = await prm         // Response
    const body = await res.text() // String
    return body.length
}

/**
 * @param  {...any} urls 
 * @returns {Promise.<Number>} Sum of the response bodies' lengths for given `urls`
 */
async function sumBodiesSizes(...urls) {
    const prms = urls.map(url => {
        console.log('Requesting ' + url)
        return getBodySize(url)
    })
    let num = 0
    for (const p of prms) {
        num += await p
        console.log('=====> Response')
    }
    return num
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

// testGetBodySize()

sumBodiesSizes(...Object.values(urls))    
    .then(sum => console.log('SUM = ' + sum))