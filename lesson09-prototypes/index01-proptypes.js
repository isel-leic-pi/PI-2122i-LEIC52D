'use strict'

// testObjectLiterals1()

// testObjectLiterals2()

withPrototype()

function withPrototype() {

    const studentPrototype = { 'average': average }

    Object.getPrototypeOf(studentPrototype).toString = function() {
        return 'I am of type ' + typeof this
    }


    function newStudent(name, nr, grades) {
        // {} => an empty object with prototype == Object
        const std = Object.create(studentPrototype)
        std.name = name
        std.nr = nr
        std.grades = grades
        return std
    }
    

    /**
     * The binding called this in its body automatically 
     * points at the object that it was called on.
     */
    const classroom = [
        newStudent('Ze Manel', 32423, [15, 17, 18, 14, 13]),
        newStudent('Maria Antonieta', 76354, [17, 15, 16, 13]),
        newStudent('Cromo da Bola', 98274, [12, 17, 10, 11]),
        newStudent('Antunes Marcelino', 1832, [18, 14, 16, 17])
    ]

    // studentPrototype.average = () => 'Ola'



    console.log(classroom[1].average())
    console.log(classroom[1].toString())
    console.log(classroom[1])
}


function testObjectLiterals2() {
    function newStudent(name, nr, grades) {
        const std = {}
        std.name = name
        std.nr = nr
        std.grades = grades
        std.average = average
        return std
    }

    const classroom = [
        newStudent('Ze Manel', 32423, [15, 17, 18, 14, 13]),
        newStudent('Maria Antonieta', 76354, [17, 15, 16, 13])
    ]
}

function testObjectLiterals1() {
/**
 *The binding called this in its body automatically 
 * points at the object that it was called on.
 */
    const classroom = [
        { name: 'Ze Manel', nr: 32423, grades: [15, 17, 18, 14, 13], average },
        { name: 'Maria Antonieta', nr: 76354, grades: [17, 15, 16, 13], average },
        { name: 'Cromo da Bola', nr: 98274, grades: [12, 17, 10, 11], average },
        { name: 'Antunes Marcelino', nr: 1832, grades: [18, 14, 16, 17], average },
    ]

    // average() // this => undefined

    console.log(classroom[0].average())
    console.log(classroom[1].average())
    console.log(classroom[2].average())
    console.log(classroom[2])
    console.log(classroom[2].toString())
    
}

/**
 * This is a closure?
 * It is using any variable of outer Scope?
 * R: No. Then it is not a Closure.
 * @returns 
 */
function average() {
    let sum = 0
    for (let i = 0; i < this.grades.length; i++) {
        const grade = this.grades[i]
        sum += grade
    }
    return sum / this.grades.length
}