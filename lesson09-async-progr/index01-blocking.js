'use strict'

let finish = false

function something() {
    console.log('doing something')
    if(!finish) 
        something()
}

setTimeout(() => {
    console.log('****** Finishing something!')
    finish = true
}, 1000) // Dispatch after 1 second

something()