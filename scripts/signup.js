function selectId(id) {
  return document.getElementById(id)
}

function errorMessage(erro) {
  return (errorListUl.innerHTML += `<li>❌ Preencha o campo <b>${erro}</b></li>`)
}

let formRef = selectId('contato-form')

let nameRef = selectId('name')
let surnameRef = selectId('surname')
let emailRef = selectId('email')
let passwordRef = selectId('password')
let repeatPw = selectId('repeatPw')
let errorListRef = selectId('errorList')

let errorListUl = document.querySelector('#errorList ul')

formRef.addEventListener('submit', e => {
  errorListUl.innerHTML = ''

  if (nameRef.value == '') {
    errorMessage('Nome')
  } else {
    selectId('checkName').innerHTML = '✔️'
  }

  if (surnameRef.value == '') {
    errorMessage('Sobrenome')
  } else {
    selectId('checkSurname').innerHTML = '✔️'
  }

  if (emailRef.value == '') {
    errorMessage('E-mail')
  } else {
    selectId('checkEmail').innerHTML = '✔️'
  }

  if (passwordRef.value == '') {
    errorMessage('Senha')
  } else {
    selectId('checkPw').innerHTML = '✔️'
  }

  if (repeatPw.value == '') {
    errorMessage('Repetir Senha')
  }

  if (passwordRef.value != repeatPw.value) {
    errorMessage("'Repetir Senha' com a mesma Senha")
  } else if (passwordRef.value == repeatPw.value && repeatPw.value != '') {
    selectId('checkRepeatPw').innerHTML = '✔️'
  }

  if (errorListUl.querySelectorAll('li').length > 0) {
    errorListRef.hidden = ''
    e.preventDefault()
  } else {
    e.preventDefault()
    let requestHeaders = {
      'Content-Type': 'application/json'
    }

    let users = {
      firstName: `${nameRef.value}`,
      lastName: `${surnameRef.value}`,
      email: `${emailRef.value}`,
      password: `${passwordRef.value}`
    }

    let configuration = {
      method: 'POST',
      body: JSON.stringify(users),
      headers: requestHeaders
    }

    fetch('https://ctd-todo-api.herokuapp.com/v1/users', configuration)
      .then(response => {
        return response.json()
      })
      .then(user => {
        //console.log(user)
        localStorage.setItem('token', user.jwt)
        location.href = 'index.html'
      })
  }
})
