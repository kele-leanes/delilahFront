const dashboard = document.querySelector('.dashboard');
const dateCont = document.querySelector('.date');
const productContainer = document.querySelector('.product-container');
const sideMenu = document.querySelector('.side-menu');
document.querySelector('.btn-primary').addEventListener('click',loadProduct);
document.querySelector('.close-icon').addEventListener('click', closeSideMenu);

function closeSideMenu() {
    sideMenu.classList.toggle('shown')
    productContainer.innerHTML = '';
}

const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

async function getUsers() {
    const users = await fetch('https://delilah-resto-acamica.herokuapp.com/usuarios',
    {
        method: 'GET',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        mode: 'cors',
        cache: 'default'
    }).then(response => response.json())
    .then(data => data.map(user => dashboard.innerHTML +=
        `<div class="order">
            <div class="order-field">${user.username}</div>
            <div class="order-field">#${user.user_id}</div>
            <div class="order-field">${user.first_name + ' ' + user.last_name}</div>
            <div class="order-field">${user.phone_number}</div>
            <div class="order-field">${user.address}</div>
            <div class="order-field">...</div>
    </div>`
        ))
    .catch(error => error) 
}

function getFecha() {
    let today = new Date();
    let date = dias[today.getDay()] + ' ' + today.getDate() + ' de ' + (meses[today.getMonth()])
    dateCont.innerHTML = date;
}

function loadProduct(){
    sideMenu.classList.toggle('shown');
    productContainer.innerHTML = 
    `<div class="login-form">
        <input type="text" id="product_name" placeholder="Nombre del producto"/>
        <input type="number" id="price" placeholder="Precio"/>
        <input type="text" id="image_url" placeholder="Url de la imagen"/>
        <p class="body-title">Es favorito</p>
        <label for="true">Si</label>
        <input type="radio" id="true" name="is_favorite" value="true">
        <label for="false">No</label>
        <input type="radio" id="false" name="is_favorite" value="false">
    </div> 
    <div class="btn-wrapper">
        <div class="btn-primary" onclick="postProduct()">AGREGAR PRODUCTO</div>
        <div class="btn-secundary" onclick="closeSideMenu()">CANCELAR</div>
    </div>   
    `
}

async function postProduct(){
    let body = {
        product_name: document.getElementById('product_name').value,
        price: document.getElementById('price').value,
        image_url: document.getElementById('image_url').value,
        is_favorite: false
    }
    
    fetch('https://delilah-resto-acamica.herokuapp.com/productos', {
        method: 'POST',
        body: JSON.stringify(body),
        mode: 'cors',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 
                'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .catch(error => console.log(error))
}

getUsers()
getFecha()