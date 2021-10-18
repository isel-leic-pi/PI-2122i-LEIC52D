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
