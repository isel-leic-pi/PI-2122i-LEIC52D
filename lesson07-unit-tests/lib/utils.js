'use strict'

module.exports = {
    flatten,
    loop
}

/**
 * @param {Array.<Array>} arr 
 */
function flatten(arr) {
    return arr.reduce((p, c) => p.concat(c),[])
}

function loop() {

}

// Hypotetical implementation of reduce
/* 
function reduce(arr, accumulator, initial) {
    let prev = initial
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        prev = accumulator(prev, item)
    }
    return prev
}
*/