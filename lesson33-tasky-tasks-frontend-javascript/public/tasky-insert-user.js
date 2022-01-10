window.onload = setup

function setup() {
    /**
     * Add listener to add user button
     */
    document
        .getElementById('btnAddUser')
        .addEventListener('click', () => handlerAddUser())
}

async function handlerAddUser() {
    try{
        const inUsername = document.querySelector('input[name="username"]')
        const path = document.location.href.replace('/users', '/api/users') + '/' + inUsername.value
        const resp = await fetch(path, { method: 'PUT'})
        if(resp.status != 201) {
            const body = await resp.text()
            alert('ERROR: ' + resp.statusText + '/n' + body)
            return
        }
        /*
        const userPath = document.location.href + '/' + inUsername.value + '/tasks'
        document
            .getElementById('listOfUsers')
            .insertAdjacentHTML('beforeend', `<li><a href="${userPath}">${inUsername.value}</a></li>`)
        */
        /*
         * Alternative approach:
         */
        document.location.href = document.location.href + '/' + inUsername.value + '/tasks'

    } catch(err) {
        alert(err)
    }
}