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
    document
        .getElementById('btLogin')
        .addEventListener('click', () => handlerLogin(inUsername, inPassword))
}

async function handlerLogin(inUsername, inPassword) {
    try{
        const path = '/login'
        const password = await digest(inPassword.value)
        const resp = await fetch(path, { 
            method: 'POST',
            body: JSON.stringify({ username: inUsername.value, password }),
            headers: { 'Content-Type': 'application/json' }
        })
        if(resp.status != 201) {
            const body = await resp.text()
            showAlert('ERROR', resp.statusText + '/n' + body)
            return
        }
        document.location.href = '/users'
    } catch(err) {
        showAlert('ERROR', err)
    }
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
            showAlert('ERROR', resp.statusText + '/n' + body)
            return
        }
        document.location.href = '/users'
    } catch(err) {
        showAlert('ERROR', err)
    }
}

async function digest(message) {
    const msgUint8 = new TextEncoder().encode(message)                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer))                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
    return hashHex
}

function showAlert(title, message, kind = 'danger') {
    const html = `<div class="alert alert-${kind} alert-dismissible fade show" role="alert">
                    <strong>${title}</strong>
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
    document
        .getElementById('alertPanel')
        .innerHTML = html
}