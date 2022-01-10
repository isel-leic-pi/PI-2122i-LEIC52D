const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())

app.use((req, res, next) => {
    // console.log(req.headers.cookie)
    console.log(req.cookies)
    next()
})

app.get('/hello', (req, res) => {
    res.end('Hello World!')
})

app.get('/boss/:name', (req, res) => {
    // res.setHeader('Set-Cookie', `boss=${req.params.name}; Path=/`)
    res.cookie('boss', req.params.name)
    res.end('Hello boss!')
})

app.get('/bro/:name', (req, res) => {
    res.cookie('bro', req.params.name, { expires: new Date(2022, 1, 11)})
    res.end('Hello bro!')
})



app.listen(3000, () => {
    console.log('Listening on port 3000')
})