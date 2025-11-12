console.log("Welcome to WinesBay E-commerce Website!");

let products = document.querySelector('.product-container'); // elemento padre

// creo nuevo div
let newProduct = document.createElement('div');
newProduct.setAttribute('class', 'product-card');

//lo agrego al DOM
products.appendChild(newProduct);