document.addEventListener('DOMContentLoaded', function() {

// // CREANDO ELEMENTOS DINÁMICAMENTE CON JS DENTRO DEL DOM

// let products = document.querySelector('.product-container'); // elemento padre

// // creo nuevo div
// let newProduct = document.createElement('div');
// newProduct.setAttribute('class', 'product-card');

// // lo agrego al DOM
// products.appendChild(newProduct);

// // para hacer backticks apreto altgr + cierre de llave dos veces = ``

// // creo elementos del producto
// const newAnchor = document.createElement('a');
// newAnchor.setAttribute('href', './product-detail.html');

// const newDiv = document.createElement('div');
// newDiv.setAttribute('class', 'product-info');

// const newImg = document.createElement('img');
// newImg.setAttribute('src', './img/img-product.jpg');
// newImg.setAttribute('alt', 'Product Image');
// newImg.setAttribute('width', '100');

// const newProductName = document.createElement('h4');
// newProductName.innerText = 'Nampe Malbec';

// const newProductPrice = document.createElement('p');
// newProductPrice.innerText = 'Precio: $12.000';

// const newProductButton = document.createElement('button');
// newProductButton.innerText = 'Agregar al Carrito';

// // agrego los elementos al div
// newDiv.appendChild(newImg);
// newDiv.appendChild(newProductName);
// newDiv.appendChild(newProductPrice);
// newDiv.appendChild(newProductButton);
// newAnchor.appendChild(newDiv);
// newProduct.appendChild(newAnchor);

// const buttons = document.querySelector('.btn-add-chart');
    
    const buttons = document.querySelectorAll('.btn-add-chart');

    buttons.forEach((button) => {
        button.addEventListener('click', function() {
                console.log('Producto agregado al carrito');
        })
    });


    

});