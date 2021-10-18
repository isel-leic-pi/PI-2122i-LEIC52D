'use strict'

const { expect } = require('@jest/globals')
const utils = require('./../lib/utils')

test('Flattening an array with 3 sub arrays', () => {
    // AAA
    /*
     * Arrange
     */
    const arr = [[3,4,5], [9], [4,7]]
    /*
     * Act
     */
    const actual = utils.flatten(arr)
    /*
     * Assert
     */
    expect(actual).toEqual([3,4,5,9,4,7])
})

test('Flattening an empty array', () => {
    expect(utils.flatten([])).toEqual([])
})
