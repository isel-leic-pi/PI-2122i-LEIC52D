'use strict'

module.exports = {
    flatten,
    yol
}

/**
 * @param {Array.<Array>} arr 
 */
function flatten(arr) {
    return arr.reduce((p, c) => p.concat(c),[])
}

/**
 * 
 * @param {*} val Initial value
 * @param {Function} test Predicate: val -> boolean
 * @param {Function} ufunc Update function
 * @param {Function} bfunc Body function
 * @returns 
 */
function yol(val, test, ufunc, bfunc){
    for(;;){
        if(!test(val))return
        bfunc(val)
        val = ufunc(val)
    }
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