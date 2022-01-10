const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log(req.headers.cookie)
    next()
})

app.get('/hello', (req, res) => {
    res.end('Hello World!')
})

app.get('/boss/:name', (req, res) => {
    res.setHeader('Set-Cookie', `boss=${req.params.name}; Path=/`)
    res.end('Hello boss!')
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})