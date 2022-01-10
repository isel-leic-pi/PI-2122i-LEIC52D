window.onload = setup

function setup() {
    /**
     * Add listener to tasks Delete
     */
    document
        .querySelectorAll('.btn-danger')
        .forEach(btn => btn.addEventListener('click', () => handlerDeleteTask(btn)))
}

/**
 * @param {Element} btn 
 */
async function handlerDeleteTask(btn) {
    /**
     * e.g. DELETE http://localhost:3000/api/users/gamboa/tasks/s2l9y2pjpnl
     */
    try {
        const path = document.location.href.replace('/users', '/api/users') + '/' + btn.dataset.taskId
        const resp = await fetch(path, { method: 'DELETE'})
        if(resp.status != 200) {
            const body = await resp.text()
            showAlert('ERROR ' + resp.statusText, body)
            return
        }
        btn
            .parentElement // td
            .parentElement // tr
            .remove()
    } catch(err) {
        showAlert('ERROR', err)
    }
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