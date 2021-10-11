console.log(range(1, 10))    // → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1)) // → [5, 4, 3, 2]

/**
 * @author Joana i52d
 */
function range(start, end, step = 1) {
    const max = (end - start) / step
    const result = []
    let current = start
    for (let i = 0; i <= max; i++) {
        result[i] = current
        current += step
    }
    return result
}