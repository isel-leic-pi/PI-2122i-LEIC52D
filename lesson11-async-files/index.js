'use strict'

const files = require('./files')

files
    .copy('dummy.txt', 'out.txt')
    .then(() => console.log('Copy finished!'))
    .catch(err => console.log(err))

files
    .copy('unknown', 'out.txt')
    .then(() => console.log('Copy finished!'))
    .catch(err => console.log(err))
