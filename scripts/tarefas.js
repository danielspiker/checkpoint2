// RECEBE DADOS DO LOGIN E PÕE NOME DO USUARIO E INICIAIS NO TOPO DA TELA ==================

let requestConfig = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token')
  }
}

fetch('https://ctd-todo-api.herokuapp.com/v1/users/getMe', requestConfig)
  .then(response => response.json())
  .then(user => {
    let userName = document.querySelector('#nomeUsuario')
    userName.innerHTML = `${user.firstName} ${user.lastName}`

    let userImageRef = document.querySelector('.user-image')
    userImageRef.innerHTML = `${user.firstName[0]}${user.lastName[0]}`
  })

// RECEBE TAREFAS ENVIADAS E AS IMPRIME NA TELA ATRAVES DO FOR ============================

fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', requestConfig)
  .then(response => {
    return response.json()
  })
  .then(tasks => {
    for (let task of tasks) {
      let dateCreated = new Date(task.createdAt)
      let tasksPending = document.querySelector('.tarefas-pendentes')
      let tasksDone = document.querySelector('.tarefas-terminadas')

      tasksPending.classList.remove('skeleton')

      if (!task.completed) {
        tasksPending.innerHTML += `<li class="tarefa">
        <div class="not-done" onclick="taskDone(${task.id})"></div>
        <div class="descricao">
          <p class="nome">${task.description}</p>
          <p class="timestamp">Procrastinado em: ${dateCreated.toLocaleDateString()}</p>
          <div class="trash">
            <button class="trashBotao" onclick="deleteTask(${task.id})">
              <img  src="./assets/trash.png" />
            </button>
          </div>
        </div>
      </li>`
      } else {
        tasksDone.innerHTML += `<li class="tarefa">
        <div class="not-done" onclick="taskNotDone(${task.id})"></div>
        <div class="descricao">
          <p class="nome">${task.description}</p>
          <p class="timestamp">Procrastinado em: ${dateCreated.toLocaleDateString()}</p>
          <div class="trash">
            <button class="trashBotao" onclick="deleteTask(${task.id})">
              <img  src="./assets/trash.png" />
            </button>
          </div>
        </div>
      </li>`
      }
    }
  })

// ENVIA NOVA TAREFA PARA A API =================================================

let formRef = document.querySelector('.nova-tarefa')

formRef.addEventListener('submit', e => {
  e.preventDefault()

  let newTask = document.querySelector('#novaTarefa')

  let requestHeaders = {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token')
  }

  let task = {
    description: newTask.value,
    completed: false
  }

  let configuration = {
    method: 'POST',
    body: JSON.stringify(task),
    headers: requestHeaders
  }

  fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', configuration).then(
    response => {
      if (response.ok) {
        location.reload()
      }
    }
  )
})

// APAGA TAREFA =============================================================

let deleteTask = id => {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
  }).then(response => {
    if (response.ok) {
      location.reload()
    }
  })
}

// PASSA NOVAS TAREFAS PARA TAREFAS TERMINADAS ====================================

//let notDone = document.querySelector('#not-done')

let taskDone = id => {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ completed: true }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
  }).then(response => {
    if (response.ok) {
      location.reload()
    }
  })
}

// PASSA TAREFAS TERMINADAS PARA NOVAS TAREFAS =================================

let taskNotDone = id => {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ completed: false }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    }
  }).then(response => {
    if (response.ok) {
      location.reload()
    }
  })
}

// FAZ 'LOGOFF' APAGANDO O TOKEN DO LOCALSTORAGE E RETORNANDO PRO INDEX ======================

let closeAppRef = document.querySelector('#closeApp')

closeAppRef.addEventListener('click', e => {
  localStorage.removeItem('token')
  location.href = 'index.html'
})
