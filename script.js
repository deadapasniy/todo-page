const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = []

const DB_URL = 'https://to-do-list-355c9-default-rtdb.europe-west1.firebasedatabase.app/'

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.completed ? 'checked' : ''} onChange="checkTodo('${todo.id}')" />
      <label for="${todo.id}">
        <span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">${todo.title}</span>
      </label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${todo.id}')">delete</button>
    </li>
  `
}

function render() {
  list.innerHTML = ''
  todos.forEach(todo => {
    list.insertAdjacentHTML('beforeend', renderTodo(todo))
  })
}

function updateCounter() {
  itemCountSpan.textContent = todos.length
  uncheckedCountSpan.textContent = todos.filter(t => !t.completed).length
}

function showLoader() {
  list.innerHTML = '<p id="loader">Завантаження...</p>'
}

function hideLoader() {
  const loader = document.getElementById('loader')
  if (loader) loader.remove()
}

async function fetchTodos() {
  try {
    showLoader()
    const res = await fetch(`${DB_URL}.json`)
    const data = await res.json()

    todos = data
        ? Object.entries(data).map(([id, todo]) => ({ id, ...todo }))
        : []

    render()
    updateCounter()
  } catch (err) {
    list.innerHTML = `<p class="text-danger">Помилка: ${err.message}</p>`
  } finally {
    hideLoader()
  }
}

async function addTodo(title) {
  const todo = { title, completed: false }
  const res = await fetch(`${DB_URL}.json`, {
    method: 'POST',
    body: JSON.stringify(todo)
  })
  const data = await res.json()
  return { id: data.name, ...todo }
}

async function newTodo() {
  const title = prompt('Введіть нову справу:')
  if (title) {
    const todo = await addTodo(title.trim())
    todos.push(todo)
    render()
    updateCounter()
  }
}

async function deleteTodo(id) {
  await fetch(`${DB_URL}/${id}.json`, { method: 'DELETE' })
  todos = todos.filter(t => t.id !== id)
  render()
  updateCounter()
}

async function checkTodo(id) {
  const todo = todos.find(t => t.id === id)
  if (!todo) return
  todo.completed = !todo.completed

  await fetch(`${DB_URL}/${id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: todo.completed })
  })

  render()
  updateCounter()
}

fetchTodos()