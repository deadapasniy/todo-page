const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = loadTodos() // Завантаження при старті

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos))
}

function loadTodos() {
  const saved = localStorage.getItem('todos')
  return saved ? JSON.parse(saved) : [
    { id: 1, title: 'Вивчити HTML', completed: true },
    { id: 2, title: 'Вивчити CSS', completed: true },
    { id: 3, title: 'Вивчити JavaScript', completed: false }
  ]
}

function newTodo() {
  const title = prompt('Введіть нове завдання:')
  if (title) {
    const newItem = {
      id: Date.now(),
      title: title.trim(),
      completed: false
    }
    todos.push(newItem)
    saveTodos()
    render()
    updateCounter()
  }
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.completed ? 'checked' : ''} onChange="checkTodo(${todo.id})" />
      <label for="${todo.id}">
        <span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">${todo.title}</span>
      </label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo(${todo.id})">delete</button>
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
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.completed).length
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id)
  saveTodos()
  render()
  updateCounter()
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    render()
    updateCounter()
  }
}

render()
updateCounter()