'use strict'

// function square(x) { return x * x }

let square = function (x) {
    return x * x 
}

let sub = function(a, b) {
    return a -b
}

console.log(square(2))        // 4
console.log(square(5, 'ola')) // 25
console.log(square())         // NaN - Not a number
console.log(square('super'))  // NaN 
console.log(`7354 - 136 = ${sub(7354, 136)}`)

const aux = sub
sub = square
square = aux

console.log(`7354 - 136 = ${sub(7354, 136)}`)
console.log(square(2))  // NaN