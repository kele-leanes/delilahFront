const carrousel = document.querySelector('.carrousel');
const productContainer = document.querySelector('.product-container');
const cartQty = document.querySelector('.cart-qty');
const cartBtn = document.querySelector('.cart');
const cartCard = document.querySelector('.cartCard');
const productList = document.querySelector('.product-list');
const cartTotal = document.querySelector('.cart-total')
const createOrderBtn = document.querySelector('.btn-primary');
const payMet = document.getElementById('pay-met');

window.onload = function () {
    getFavorites()
    getProducts()
}


cartBtn.addEventListener('click', openCart);
createOrderBtn.addEventListener('click', createOrder);

let total = 0;
let dbproducts = [];
let productIds = [];
let orderProducts = [];

function openCart(){
    cartCard.classList.toggle('shown');
}

function showProductsCart(){
    if(productIds.length){
        productIds.forEach(ids=>getProductById(ids));
    } else {
        cartCard.innerHTML = '<div class="body-title">El carrito está vacío</div>';
    }    
}

async function getFavorites() {
    const favorites = await fetch('https://delilah-resto-acamica.herokuapp.com/productos/favoritos')
    .then(response => response.json())
    .then(data => data.map(product => carrousel.innerHTML +=
        `<div class='favorite-card'>
        <div class="img-container">
            <img src="${product.image_url}" alt="">
            <div class='favorite-title'>${product.product_name}</div>
        </div>
        <div class="action-wrapper">
            <div class='product-price'>$${product.price}</div>
            <div class='add-favorite-btn' data-id="${product.product_id}">AÑADIR</div>
        </div>`))       
}

async function getProducts() {
    const products = await fetch('https://delilah-resto-acamica.herokuapp.com/productos')
    .then(response => response.json())
    .then(data => dbproducts = data)
    .then(renderProducts)
    .then(async () => await document.querySelectorAll('.add-product-btn').forEach(element => element.addEventListener('click', addProductToCart))
    )
}

async function renderProducts(){
    await dbproducts.map(product => productContainer.innerHTML +=
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
                <div class="add-product-btn" data-id="${product.product_id}">+</div>
            </div>
        </div>`)
}

async function getProductById(id){
    const products = await fetch(`https://delilah-resto-acamica.herokuapp.com/productos/${id}`)
    .then(response => response.json())
    .then(data => data.map(product))
}

let body= { product_id: '', product_qty: 1};

function addProductToCart(){
    productIds.push(this.dataset.id);
    totalCalc();
    rendenrCart();
}

function totalCalc() {
    total = 0;
    for (let item of productIds) {
        let miItem = dbproducts.filter(function(product) {
            return product.product_id == item;
        });
        total = total + miItem[0].price;
    }
    cartTotal.innerHTML = `TOTAL: $${total}`;
}


function rendenrCart() {
    productList.innerHTML = '';
    orderProducts = [];
    let carritoSinDuplicados = [...new Set(productIds)];
    carritoSinDuplicados.forEach(function (item, indice) {
        let miItem = dbproducts.filter(function(product) {
            return product.product_id == item;
        });
        let numeroUnidadesItem = productIds.reduce(function (total, itemId) {
            return itemId === item ? total += 1 : total;
        }, 0);
        console.log(numeroUnidadesItem, miItem[0].product_id)
        orderProducts.push({ product_id: miItem[0].product_id, product_qty: numeroUnidadesItem });
        console.log(orderProducts)
        productList.innerHTML +=
         `<div class="product">
                    <div class="left-column">
                    <div class="img-product">
                        <img src="${miItem[0].image_url}" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-title">${miItem[0].product_name}</div>
                        <div class="product-price">$${miItem[0].price}</div>
                    </div>
                </div> 
                <div class="product-price">Qty: ${numeroUnidadesItem}</div>   
                <div class="add-product-btn" data-id="${miItem[0].product_id}" onclick="removeProductFromCart()">-</div>
             </div>
         `
    })
    cartQty.classList.add('shown')
    cartQty.innerHTML = productIds.length
}    

function removeProductFromCart () {
    console.log()
    // Obtenemos el producto ID que hay en el boton pulsado
    let id = event.target.dataset.id;
    // Borramos todos los productos
    productIds = productIds.filter(function (productId) {
        return productId !== id;
    });
    // volvemos a renderizar
    rendenrCart();
    // Calculamos de nuevo el precio
    totalCalc();
}

async function createOrder() {
    let body = {
        products: orderProducts,
        payment_method: payMet.value
    }

    await fetch('https://delilah-resto-acamica.herokuapp.com/ordenes', {
        method: 'POST',
        body: JSON.stringify(body),
        mode: 'cors',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 
                'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .catch(error => console.log(error))
    
}