window.onload = setup

function setup() {
    const target = document.getElementById('btNewTask')
    // const target = document.querySelector('#btNewTask"') // <=> to abose statement
    const inTitle = document.querySelector('input[name="title"]')
    const inDesc = document.querySelector('input[name="desc"]')
    const inDueDate = document.querySelector('input[name="dueDate"]')
    target.addEventListener('click', () => handlerNewTask(inTitle, inDesc, inDueDate))
    document
        .querySelectorAll('.btn-danger')
        .forEach(btn => btn.addEventListener('click', () => handlerDeleteTask(btn)))
}

/**
 * @param {Element} btn 
 */
function handlerDeleteTask(btn) {
    btn
        .parentElement // td
        .parentElement // tr
        .remove()
}

function handlerDeleteTaskWithId(btnId) {
    handlerDeleteTask(document.getElementById(btnId))
}

function handlerNewTask(inTitle, inDesc, inDueDate) {
    const tbody = document.querySelector('tbody')
    const fragment = fragmentRow(inTitle.value, inDesc.value, inDueDate.value)
    tbody.insertAdjacentHTML('afterbegin', fragment)
}

function fragmentRow(title, desc, dueDate) {
    if(!title || title === '') return alert('Title cannot be undefined!!!!')
    return `<tr>
        <td>
            <button id="${title}" class="btn btn-danger" onClick="handlerDeleteTaskWithId('${title}')">Delete</button>
        </td>
        <td>${title}</td>
        <td>${desc}</td>
        <td>${dueDate}</td>
    </tr>`
}