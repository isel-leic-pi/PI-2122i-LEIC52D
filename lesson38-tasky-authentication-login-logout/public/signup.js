window.onload = setup

function setup() {
    const inUsername = document.getElementById('inUsername')
    const inPassword = document.getElementById('inPassword')
    /**
     * Add listener to add user button
     */
    document
        .getElementById('btSignup')
        .addEventListener('click', () => handlerSignup(inUsername, inPassword))
}

async function handlerSignup(inUsername, inPassword) {
    try{
        const path = '/signup/' + inUsername.value
        const password = await digest(inPassword.value)
        const resp = await fetch(path, { 
            method: 'PUT',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' }
        })
        if(resp.status != 201) {
            const body = await resp.text()
            alert('ERROR: ' + resp.statusText + '/n' + body)
            return
        }
        document.location.href = '/users'
    } catch(err) {
        alert(err)
    }
}

async function digest(message) {
    const msgUint8 = new TextEncoder().encode(message)                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer))                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
    return hashHex
}
  