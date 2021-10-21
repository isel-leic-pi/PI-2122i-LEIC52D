'use strict'

function Student(name, nr, grades) {
    this.name = name
    this.nr = nr
    this.grades = grades
}

Student.prototype.average = function () {
    let sum = 0
    for (let i = 0; i < this.grades.length; i++) {
        const grade = this.grades[i]
        sum += grade
    }
    return sum / this.grades.length
}

Student.prototype.toString = function () {
    return JSON.stringify(this)
}

const classroom = [
    new Student('Ze Manel', 32423, [15, 17, 18, 14, 13]),
    new Student('Maria Antonieta', 76354, [17, 15, 16, 13]),
    new Student('Cromo da Bola', 98274, [12, 17, 10, 11]),
    new Student('Antunes Marcelino', 1832, [18, 14, 16, 17])
]

console.log(classroom[1].average())
console.log(classroom[1].toString())
console.log(classroom[1])


