'use strict'

const http = require('http')

const server = http.createServer(listener)

server.listen(4000, () => {
    console.log('Listening on port ' + 4000)
})
/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function listener(req, res) {
    res.setHeader('content-type', 'text/plain')
    res.write('Hello World: ' + req.url)
    res.end() // Send the response and finishes the connection
}