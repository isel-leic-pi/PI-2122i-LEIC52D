'use strict'

const http = require('http')
const lastfm = require('./lastfm')

const server = http.createServer(listener)

server.listen(4000, () => {
    console.log('Listening on port ' + 4000)
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
        lastfm
            .getTopArtists(country)
            .then(topArtists => {
                res.setHeader('content-type', 'application/json')
                res.write(JSON.stringify(topArtists))
                res.end() // Send the response and finishes the connection
            })
    }
}