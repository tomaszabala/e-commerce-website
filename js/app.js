import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

document.addEventListener('DOMContentLoaded', function() {
    
    
    //dom elements
    const productsDomElements = document.querySelector('.products-container'); // elemento padre
    const inputSearch = document.getElementById('input-search-products');
    const categoryLinks = document.querySelectorAll('.category-product-filter');

    //data Airtable
    const API_TOKEN = AIRTABLE_TOKEN;
    const baseId = BASE_ID;
    const tableName = TABLE_NAME;
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    // estado global
    let listProducts = [];
    const currentFilters = { text: '', category: ''};

    //events
    inputSearch.addEventListener('keyup', (event) => { // keyup para que se dispare el evento al soltar la tecla cuando se busca algo
        currentFilters.text = event.target.value.toLowerCase();
        renderProducts(filterProducts());
    });

    categoryLinks.forEach( link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.innerText.toLowerCase();
            currentFilters.category = (currentFilters.category === category) ? '' : category;
            renderProducts(filterProducts());
        });
    });

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

    function filterProducts() {
        return listProducts.filter(product =>
          product.name.toLowerCase().includes(currentFilters.text) &&
          (currentFilters.category === '' || product.category.toLowerCase() === currentFilters.category)
        );
        // name.toLowerCase para que no importe mayusculas o minusculas
        // includes para ver si el texto que estoy escribiendo está incluido en el nombre del producto
    }


    function renderProducts(products) {
        productsDomElements.innerHTML = ''; // limpio el contenedor antes de agregar los productos filtrados, para que no queden productos de busquedas anteriores
        products.forEach( product => {
            const newProduct = createProduct(product);
            productsDomElements.appendChild(newProduct);
        });
    }


    // Una promesa es un objeto que representa la finalización o el fracaso de una operación asincrónica.
    // Fetch es un método nativo de javascript que nos permite hacer peticiones HTTP asincrónicas a un servidor y devuelve una promesa.
    // Scrapear: Significa tomar datos de una página, es utilizado mucho hoy en día.
    // Por ejemplo puedo tomar datos de un listado de autos de Mercado Libre y aplicarle técnicas de scraping para poder utilizar el código en mi propia web.


    // Airtable functions and promises
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
            listProducts = mappedProducts; // actualizar la lista de productos con los datos de Airtable
            console.log('mapped products from Airtable:', mappedProducts);
            renderProducts(mappedProducts);
        }
        catch (error) { // el catch se ejecuta si hay un error en el try
            console.error('Error fetching products from Airtable:', error);
        }
    }

    getProductsFromAirtable();

    //inicialización
    renderProducts(listProducts);

    async function editProductInAirtable (product) {
        try {
            const response = await fetch(`${airtableUrl}/rec2FoMmRsp26VATJ`, {
                method: 'PATCH',  //si no le indico el método, por defecto siempre va a ser GET
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`, // le indico el token de autorización, siempre debe llevar 'Bearer ' antes del token
                    'Content-Type': 'application/json'  // le indico que el contenido de la promesa es un objeto JSON
                },
                body: JSON.stringify({  // lo transformo porque el contenido del body de una promesa HTTP siempre deben ser un string
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

    // editProductInAirtable({
    //     name: 'Nampe Malbec Edited',
    //     price: 125,
    //     category: 'Malbec',
    //     img: './img/img-product.jpg'
    // });

});