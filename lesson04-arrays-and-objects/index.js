demo1()
demo2()
demo3()
demo4()
demo5()

function demo1() {
    const listOfNumbers = [2, 3, 5, 7, 11]
    
    console.log(listOfNumbers)        // → [2, 3, 5, 7, 11]
    console.log(listOfNumbers[0])     // → 2
    console.log(listOfNumbers[2 - 1]) // → 3


    listOfNumbers[2]
    listOfNumbers['jhon doe']
}

function demo2() {
    const sequence = [1, 2, 3]
    sequence.push(4)
    sequence.push(5)
    console.log(sequence) // → [1, 2, 3, 4, 5]
    console.log(sequence.pop()) // → 5
    console.log(sequence) // → [1, 2, 3, 4]
}

function demo3() {
    const arr = [2, 3, 5, 7, 11]   
    for (let i = 0; i < arr['length']; i++) {
        const item = arr[i]
        console.log(item)
    }
}

function demo4() {
    const student1 = {
        name: 'David Byrne',
        number: 82364, 
        grades: [
            { course: 'AVE', grade: 19 },
            { course: 'MPD', grade: 18 },
            { course: 'PSC', grade: 20 },
            { course: 'PDM', grade: 18 }
        ]
    }
    console.log(student1)
    console.log(student1.address) // → undefined
    student1.address = 'Road to nowhere'
    delete student1.grades
    console.log(student1) // →  { name: 'David Byrne', number: 82364, address: 'Road to nowhere' }
}

function demo5() {
    console.log(Object.keys({x: 0, y: 0, z: 2})) // → ["x", "y", "z"]

    let objectA = {a: 1, b: 2}
    Object.assign(objectA, {b: 3, c: 4})
    console.log(objectA) // → {a: 1, b: 3, c: 4}
    
    let object1 = {value: 10}
    let object2 = object1
    let object3 = {value: 10}
    
    console.log(object1 == object2) // → true
    console.log(object1 == object3) // → false
    
    const kim = 'Kim'
    kim.age = 88
    console.log(kim.age) // → undefined
}
