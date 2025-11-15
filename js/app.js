document.addEventListener('DOMContentLoaded', function() {
    
    //data
    const listProducts = [
        {name: 'Nampe Malbec', price: 12000, img: './img/img-product.jpg'},
        {name: 'Nampe Cabernet', price: 13000, img: './img/img-product.jpg'},
        {name: 'Nampe Syrah', price: 12500, img: './img/img-product.jpg'},
        {name: 'Nampe Torrontes', price: 11000, img: './img/img-product.jpg'},
        {name: 'Nampe Chardonnay', price: 11500, img: './img/img-product.jpg'},
        {name: 'Nampe Malbec Rosé', price: 14000, img: './img/img-product.jpg'},
    ];

    //dom elements
    const productsDomElements = document.querySelector('.products-container'); // elemento padre
    const inputSearch = document.getElementById('input-search-products');
 
    //functions
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
        newProductButton.addEventListener('click', (event) => {
            event.preventDefault(); // para que no navegue al detalle del producto al hacer click en el boton
            console.log(`Producto ${product.name} agregado al carrito.`);
        });
        
        // agrego los elementos al div
        newDiv.appendChild(newImg);
        newDiv.appendChild(newProductName);
        newDiv.appendChild(newProductPrice);
        newDiv.appendChild(newProductButton);
        newAnchor.appendChild(newDiv);
        newProduct.appendChild(newAnchor);

        return newProduct;
    }

    function filterProducts(text) {
        const productsfilterted = listProducts.filter( product => product.name.toLowerCase().includes(text.toLowerCase())); 
        //name.toLowerCase para que no importe mayusculas o minusculas
        // includes para ver si el texto que estoy escribiendo está incluido en el nombre del producto
        return productsfilterted;
    }

    function renderProducts(products) {
        productsDomElements.innerHTML = ''; // limpio el contenedor antes de agregar los productos filtrados, para que no queden productos de busquedas anteriores
        products.forEach( product => {
            const newProduct = createProduct(product);
            productsDomElements.appendChild(newProduct);
        });
    }

    //events
    inputSearch.addEventListener('keyup', function(event) { // keyup para que se dispare el evento al soltar la tecla cuando se busca algo
        const searchText = event.target.value;
        const filteredProducts = filterProducts(searchText);
        renderProducts(filteredProducts);
    });
    
    //inicialización
    renderProducts(listProducts);

});