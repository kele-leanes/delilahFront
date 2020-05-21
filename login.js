const btnLogin = document.querySelector('.btn-primary');
const btnRegister = document.querySelector('.btn-secundary');

btnLogin.addEventListener('click', login);
btnRegister.addEventListener('click', () => window.location.assign('/register.html'))

async function login() {
    let body = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    }
    
    fetch('https://delilah-resto-acamica.herokuapp.com/login', {
        method: 'POST',
        body: JSON.stringify(body),
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => sessionStorage.setItem("token", data.token))
    .then(async ()=> { await window.location.assign('/')})
};