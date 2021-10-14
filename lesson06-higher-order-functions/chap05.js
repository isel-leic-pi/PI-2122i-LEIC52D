'use strict'

/**
 * @param {Array.<{tempC: Number, desc: String, date: Date}} pastWeather 
 * @returns Array of numbers with top 5 temperatures
 */
function firstTempsWith(pastWeather, label, limit) {
    const res = []
    // <=> for (const weather of pastWeather[Symbol.iterator]()) {
    for (const weather of pastWeather) {
        if(weather.desc.toLowerCase().includes(label)) { // filtering
            res.push(weather.tempC)                      // mapping
            if(res.length == limit)                      // limiting
                break
        }
    }
    return res
}

/**
 * @param {Array.<{tempC: Number, desc: String, date: Date}} pastWeather 
 * @returns Array of numbers with first temperatures
 */
function firstTempsWithInChain(pastWeather, label, limit) {
    return pastWeather
        .filter(w => w.desc.toLowerCase().includes(label))
        .map(w => w.tempC)
        .slice(0, limit)
}

const weatherInLibon = [
    { date: new Date(2021, 10, 1), desc: 'Sunny', tempC: 18},
    { date: new Date(2021, 10, 2), desc: 'Passing clouds', tempC: 21},
    { date: new Date(2021, 10, 3), desc: 'Rainny', tempC: 22},
    { date: new Date(2021, 10, 4), desc: 'Sun shning', tempC: 17},
    { date: new Date(2021, 10, 5), desc: 'Sunny', tempC: 16},
    { date: new Date(2021, 10, 6), desc: 'Rainny', tempC: 15},
    { date: new Date(2021, 10, 7), desc: 'Heavy clouds', tempC: 23},
    { date: new Date(2021, 10, 8), desc: 'Bright sun', tempC: 28},
    { date: new Date(2021, 10, 9), desc: 'Sunny', tempC: 22},
]

console.log(firstTempsWith(weatherInLibon, 'sun', 3))
console.log(firstTempsWithInChain(weatherInLibon, 'sun', 3))

console.log(firstTempsWith(weatherInLibon, 'rain', 3))
console.log(firstTempsWithInChain(weatherInLibon, 'rain', 3))
