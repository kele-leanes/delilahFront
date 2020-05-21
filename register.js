const btnLogin = document.querySelector('.btn-secundary');
const btnRegister = document.querySelector('.btn-primary');

btnLogin.addEventListener('click', () => window.location.assign('/login.html'))
btnRegister.addEventListener('click', register);

async function register() {
    let body = {
        username: document.getElementById('username').value,
        first_name: document.getElementById('name').value,
        last_name: document.getElementById('lastname').value,
        mail: document.getElementById('mail').value,
        phone_number: document.getElementById('phone_number').value,
        address: document.getElementById('address').value,
        password: document.getElementById('password').value
    }
    
    fetch('https://delilah-resto-acamica.herokuapp.com/registrarse', {
        method: 'POST',
        body: JSON.stringify(body),
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(async ()=> { await window.location.assign('/login.html')})
};