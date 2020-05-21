const carrousel = document.querySelector('.carrousel');
const productContainer = document.querySelector('.product-container');
const cartQty = document.querySelector('.cart-qty');
const cartBtn = document.querySelector('.cart');
const cartCard = document.querySelector('.cartCard');

cartBtn.addEventListener('click', openCart);

let cart = []

function openCart(){
    cartCard.classList.toggle('shown');
}

function showProductsCart(){
    
}

getFavorites()
getProducts()

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
            <div class='add-favorite-btn' data-id="${product.product_id}" onclick="addProductToCart()">AÑADIR</div>
        </div>`))       
}

async function getProducts() {
    const products = await fetch('https://delilah-resto-acamica.herokuapp.com/productos')
    .then(response => response.json())
    .then(data => data.map(product => productContainer.innerHTML +=
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
                <div class="add-product-btn" data-id="${product.product_id}" onclick="addProductToCart()">+</div>
            </div>
        </div>`))
    
}

async function getProductById(id){
    const products = await fetch(`https://delilah-resto-acamica.herokuapp.com/productos/${id}`)
    .then(response => response.json())
    .then(data => data.map(product => cartCard.innerHTML +=
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
                <div class="add-product-btn" data-id="${product.product_id}" onclick="removeProductFromCart()">-</div>
            </div>
        </div>`))
}

function addProductToCart(){
    const productId = event.target.dataset.id;
    let productAdded = parseInt(productId);
    cart.push(productAdded);
    cartQty.classList.add('shown')
    cartQty.innerHTML = cart.length;
    getProductById(productId)
}

function removeProductFromCart() {
    
}