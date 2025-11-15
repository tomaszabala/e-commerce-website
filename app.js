document.addEventListener('DOMContentLoaded', function() {
    
    const listProducts = [
        {name: 'Nampe Malbec', price: 12000, img: './img/img-product.jpg'},
        {name: 'Nampe Cabernet', price: 13000, img: './img/img-product.jpg'},
        {name: 'Nampe Syrah', price: 12500, img: './img/img-product.jpg'},
        {name: 'Nampe Torrontes', price: 11000, img: './img/img-product.jpg'},
        {name: 'Nampe Chardonnay', price: 11500, img: './img/img-product.jpg'},
        {name: 'Nampe Malbec Rosé', price: 14000, img: './img/img-product.jpg'},
    ];


    // CREANDO ELEMENTOS DINÁMICAMENTE CON JS DENTRO DEL DOM

    const productsDomElements = document.querySelector('.products-container'); // elemento padre


    function createProduct(product) {

        // creo el nuevo div
        const newProduct = document.createElement('div');
        newProduct.setAttribute('class', 'product-card');

        
        // creo elementos del producto
        const newAnchor = document.createElement('a');
        newAnchor.setAttribute('href', './product-detail.html');
        
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'product-info');
        
        const newImg = document.createElement('img');
        newImg.setAttribute('src', product.img);
        newImg.setAttribute('alt', product.name);
        newImg.setAttribute('width', '100px');
        
        const newProductName = document.createElement('h4');
        newProductName.setAttribute('class', 'product-name');
        newProductName.innerText = product.name;
        
        const newProductPrice = document.createElement('p');
        newProductPrice.setAttribute('class', 'product-price');
        newProductPrice.innerText = `Precio: $${product.price}`;
        
        const newProductButton = document.createElement('button');
        newProductButton.innerText = 'Agregar al Carrito';
        
        // agrego los elementos al div
        newDiv.appendChild(newImg);
        newDiv.appendChild(newProductName);
        newDiv.appendChild(newProductPrice);
        newDiv.appendChild(newProductButton);
        newAnchor.appendChild(newDiv);
        newProduct.appendChild(newAnchor);

        return newProduct;
    }

    listProducts.forEach( product => {
        const newProduct = createProduct(product);
        productsDomElements.appendChild(newProduct);
    });

});