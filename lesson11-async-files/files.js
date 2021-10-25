'use strict'

const fs = require('fs/promises')

module.exports = { copy }

/**
 * This function already exist in the fs API.
 * Only for pedagogic goals.
 * 
 * @param {String} from Path to the origin file
 * @param {String} to Path to the destination file
 * @returns {Promise.<undefined>} Fulfills with undefined upon success.
 */
function copy(from, to) {
    const prm = fs.readFile(from)             // Promise<String>
    /* NOT POSSIBLE!
     * fs.writeFile(to, prm.getValue())
     */
    return prm.then(data => fs.writeFile(to, data))  // Promise<Promise<undefined>>
}