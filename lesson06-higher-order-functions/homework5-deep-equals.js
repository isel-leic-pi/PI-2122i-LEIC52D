function deepEqual(obj1, obj2){
    if(typeof(obj1) !== 'object') return obj1 === obj2
    if (obj1 === obj2) return true
    if (!(obj1 && obj2)) return false
    for (const key in obj1) {
        if (deepEqual(obj1[key], obj2[key]) == false) 
            return false
    }
    return true
}

const s1 = { name: 'ze manel', nr: 24861}
const s2 = { name: 'ze manel', nr: 24861}
const s3 = { name: 'ze manel', nr: 76153}
const s4 = { name: 'ze manel', nr: 24861, addr: 'rua rosa'}

console.log(`s1 equals s2 = ${deepEqual(s1,s2)}`) // true
console.log(`s1 equals s3 = ${deepEqual(s1,s3)}`) // false
console.log(`s1 equals s4 = ${deepEqual(s1,s4)}`) // true !!! wrong !!