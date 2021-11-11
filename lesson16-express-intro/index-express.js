const express = require('express')
const app = express()
const wiki = require('./wiki')
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/wiki', wiki)

app.use('/foo', (req, res, next) => {
    console.log('Request to ' + req.url)
    next()
})

app.get('/foo/dummy', (req, res) => {
    res.send('Foo dummy!')
})
app.get('/foo', (req, res) => {
    res.send('Foo!')
})
app.get('/bar', (req, res) => {
    res.send('bar!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})
