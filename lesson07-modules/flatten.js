'use strict'

// <=> export function flatten() { console.log('I am flatten!') }


function flatten() {

    console.log('I am flatten!')
}

module.exports = {
    'flatten': flatten, // <=> flatten
    'hello': () => console.log('hello')
}