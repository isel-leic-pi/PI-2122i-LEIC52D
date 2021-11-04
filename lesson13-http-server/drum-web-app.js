'use strict'

const { count } = require('console')
const http = require('http')
const fetch = require('node-fetch')

const server = http.createServer(listener)

server.listen(8080, () => {
    console.log('Listening on port 8080')
})
/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function listener(req, res) {
    /*
     * Validate the path request
     */
    const [, artists, country] = req.url.split('/') // ['', 'artists', <country>]
    if(artists != 'artists' || !country) {
        res.statusCode = 404 // Resource not found
        res.setHeader('content-type', 'text/plain')
        res.write('Wrong path to: ' + req.url)
        res.end() // Send the response and finishes the connection
    } else {
        fetch('http://localhost:4000/artists/' + country)
            .then(res => res.text())
            .then(body => JSON.parse(body))
            .then(arr => {
                res.setHeader('content-type', 'text/html')
                res.write(template(arr.map(a => `<li>${a}</li>`).join('\n'), country))
                res.end() // Send the response and finishes the connection
            })        
    }
}
function template(arr, country) {
    return `
<html>
    <head><title>DRUM</title></head>
    <body>
        <h1>Top Artists in ${country}</h1>
        <ul>
            ${arr}
        </ul>
    </body>
</html>
    `
}