document.addEventListener('DOMContentLoaded', function() {
    
    //data
    const listProducts = [
        {id:1, name: 'Nampe Malbec', category: 'Malbec', price: 12000, img: './img/img-product.jpg'},
        {id:2, name: 'Nampe Cabernet', category: 'Cabernet', price: 13000, img: './img/img-product.jpg'},
        {id:3, name: 'López Syrah', category: 'Syrah', price: 12500, img: './img/img-product.jpg'},
        {id:4, name: 'Los Alamos Syrah', category: 'Syrah', price: 11000, img: './img/img-product.jpg'},
        {id:5, name: 'Nampe Chardonnay', category: 'Chardonnay', price: 11500, img: './img/img-product.jpg'},
        {id:6, name: 'Casillero Malbec Rosé', category: 'Malbec', price: 14000, img: './img/img-product.jpg'},
    ];

    //dom elements
    const productsDomElements = document.querySelector('.products-container'); // elemento padre
    const inputSearch = document.getElementById('input-search-products');

    //data Airtable
    const API_TOKEN = "patvZf4rDTzTZtlSm.63b377870a77b473e4249c16e5e4e29bea5d2c3ea955ed61562ec3a69d1003f5";
    const BASE_ID = "apprjdFndW1TUrjzi";
    const TABLE_NAME = "Products";
    const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

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
        newProductName.setAttribute('id', `product-name-${product.id}`);
        newProductName.innerText = product.name;

        const newProductCategory = document.createElement('p');
        newProductCategory.setAttribute('class', 'product-category');
        newProductCategory.innerText = product.category;
        
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
        newDiv.appendChild(newProductCategory);
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
    inputSearch.addEventListener('input', function(event) { // keyup para que se dispare el evento al soltar la tecla cuando se busca algo
        const searchText = event.target.value;
        const filteredProducts = filterProducts(searchText);
        renderProducts(filteredProducts);
    });
    
    //inicialización
    renderProducts(listProducts);

    
    // Airtable functions
    async function getProductsFromAirtable () {
        try {
            const response = await fetch(airtableUrl, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            console.log('products from Airtable', data);
            const mappedProducts = data.records.map (item => ({
                name: item.fields.Name,
                price: item.fields.Price,
                img: item.fields.Img,
                category: item.fields.Category
            }));
            console.log('mapped products:', mappedProducts);
            renderProducts(mappedProducts);
        }
        catch (error) {
            console.error('Error fetching products from Airtable:', error);
        }
    }

    getProductsFromAirtable();

    async function editProductInAirtable (product) {
        try {
            const response = await fetch(`${airtableUrl}/rec2FoMmRsp26VATJ`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        Name: product.name,
                        Price: product.price,
                        Category: product.category,
                        Img: product.img
                    }
                })
            });
            const data = await response.json();
            console.log('edited product:', data);
        } catch (error) {
            console.error('Error editing product in Airtable:', error);
        }
    }

    editProductInAirtable({
        name: 'Nampe Malbec Edited',
        price: 125,
        category: 'Malbec',
        img: './img/img-product.jpg'
    });

});