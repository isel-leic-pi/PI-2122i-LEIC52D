'use strict'

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

test('Your own Loop, aka yol function test', () => {
    const arr = []
    utils.yol(
        3, 
        n => n > 0, 
        n => n - 1, 
        item => arr.push(item))
    expect(arr).toEqual([3,2,1])
})