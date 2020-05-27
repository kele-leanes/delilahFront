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

async function getOrders() {
    const orders = await fetch('https://delilah-resto-acamica.herokuapp.com/ordenes',
    {
        method: 'GET',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        mode: 'cors',
        cache: 'default'
    }).then(response => response.json())
    .then(data => data.map(order => dashboard.innerHTML +=
        `<div class="order">
        <div class="order-field" style="background-color:${statusColor(order.order_status)};color:white">${order.order_status}</div>
        <div class="order-field">#${order.order_id}</div>
        <div class="order-field">${order.products.map(product => product.product_qty +'x'+ product.product_name.slice(0,4))}</div>
        <div class="order-field">${paymentMethod(order.payment_method)} ${order.order_amount}</div>
        <div class="order-field">${order.username}</div>
        <div class="order-field">${order.address}</div>
        <div class="order-field" onclick="detailsOrder(${order.order_id})">...</div>
    </div>`
        ))
    .catch(error => error) 
}

getOrders()
getFecha()

function statusColor(status) {
    let color;
    switch(status) {
        case 'New':
            color = 'red';
            break; 
        case 'Confirmed':
            color = 'orange';
            break;     
        case 'Shipped':
            color = 'green';
            break;
        case 'Delivery':
            color = 'cornflowerblue';
            break;    
        case 'Preparing':
            color = 'gold';
        }
    return color
}

function paymentMethod(method){
    if(method == 'Card'){
        return '<i class="fas fa-credit-card"></i>'
    } else {
        return '<i class="fas fa-wallet"></i>'
    }
}

function getFecha() {
    let today = new Date();
    let date = dias[today.getDay()] + ' ' + today.getDate() + ' de ' + (meses[today.getMonth()])
    dateCont.innerHTML = date;
}

async function detailsOrder(id) {
    sideMenu.classList.toggle('shown');
        const orders = await fetch(`https://delilah-resto-acamica.herokuapp.com/ordenes/${id}`,
        {
            method: 'GET',
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            mode: 'cors',
            cache: 'default'
        }).then(response => response.json())
        .then(data => data[0].products.map(product => productContainer.innerHTML +=
            `<div class="product-list">
                <div class="product">
                    <div class="left-column">
                        <div class="img-product">
                            <img src="${product.image_url}" alt="">
                        </div>
                        <div class="product-info">
                            <div class="product-title">${product.product_name}</div>
                            <div class="product-price">$${product.price}</div>
                        </div>
                    </div>    
                </div>
            </div>`))
}

function loadProduct(){
    sideMenu.classList.toggle('shown');
    productContainer.innerHTML = 
    `<div class="login-form">
        <input type="text" id="product_name" placeholder="Nombre del producto"/>
        <input type="number" id="price" placeholder="Precio"/>
        <input type="text" id="image_url" placeholder="Url de la imagen"/>
        <div class="favorite">
                <select name="is-favorite" id="is-favorite">
                    <option value="true">Si</option>
                    <option value="false">No</option>
                </select>
            </div>
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