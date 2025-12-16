document.addEventListener('DOMContentLoaded', function() {

    const API_TOKEN = "patvZf4rDTzTZtlSm.36eabe7c235010352960974d5604d020d140d9bfb39e772a0a8d5937f8171b83";
    const baseId = "apprjdFndW1TUrjzi";
    const tableName = "Products";
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

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
                recordId: item.id,
                name: item.fields.Name,
                price: item.fields.Price,
                img: item.fields.Img,
                category: item.fields.Category
            }));
            listProducts = mappedProducts; 
            console.log('mapped products from Airtable:', mappedProducts);
            renderProducts(mappedProducts);
        }
        catch (error) {
            console.error('Error fetching products from Airtable:', error);
        }
    }

    
    // Inicializar cartCounter al cargar la página
    updateCartCounter();
    
    
    //dom elements
    const productsDomElements = document.querySelector('.products-container'); 
    const inputSearch = document.getElementById('input-search-products');
    const categoryLinks = document.querySelectorAll('.category-product-filter');

    
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

        const newProduct = document.createElement('div');
        newProduct.setAttribute('class', 'product-card');

        const newAnchor = document.createElement('a');
        newAnchor.setAttribute('href',  `./product-detail.html?code=${encodeURIComponent(product.recordId)}`);
        
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'product-info');
        
        const newImg = document.createElement('img');
        newImg.setAttribute('src', product.img);
        newImg.setAttribute('alt', product.name);
        newImg.setAttribute('width', '100px');
        
        const newProductName = document.createElement('h4');
        newProductName.setAttribute('class', 'product-name');
        newProductName.setAttribute('id', `product-name-${product.recordId}`);
        newProductName.innerText = product.name;

        const newProductCategory = document.createElement('p');
        newProductCategory.setAttribute('class', 'product-category');
        newProductCategory.innerText = product.category;
        
        const newProductPrice = document.createElement('p');
        newProductPrice.setAttribute('class', 'product-price');
        newProductPrice.innerText = `Precio: $${product.price}`;
        
        const newProductButton = document.createElement('button');
        newProductButton.setAttribute('class', 'btn-add-product');
        newProductButton.innerText = 'Agregar al Carrito';
        newProductButton.addEventListener('click', (event) => {
            event.preventDefault();
            addToCart(product);
        });
        
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

    
    function addToCart(product) {
        let cart = [];
        
        // Cargar carrito existente
        const savedCart = localStorage.getItem('winesbay-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        // Buscar si el producto ya existe
        const existingProduct = cart.find(item => item.recordId === product.recordId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                recordId: product.recordId,
                name: product.name,
                price: product.price,
                category: product.category,
                img: product.img,
                quantity: 1
            });
        }
        
        // Guardar en localStorage
        localStorage.setItem('winesbay-cart', JSON.stringify(cart));
        
        // Actualizar cartCounter
        updateCartCounter();
        
        console.log(`${product.name} agregado al carrito`);
    }
    
    
    function updateCartCounter() {
        const savedCart = localStorage.getItem('winesbay-cart');
        let cart = savedCart ? JSON.parse(savedCart) : [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        let cartCounter = document.querySelector('.cart-counter');
        
        if (totalItems > 0) {
            if (!cartCounter) {
                cartCounter = document.createElement('span');
                cartCounter.setAttribute('class', 'cart-counter');
                const cartLink = document.querySelector('.nav-cart');
                if (cartLink) {
                    cartLink.appendChild(cartCounter);
                }
            }
            cartCounter.innerText = totalItems;
        } else {
            if (cartCounter) {
                cartCounter.remove();
            }
        }
    }

    // Una promesa es un objeto que representa la finalización o el fracaso de una operación asincrónica.
    // Fetch es un método nativo de javascript que nos permite hacer peticiones HTTP asincrónicas a un servidor y devuelve una promesa.
    // Scrapear: Significa tomar datos de una página, es utilizado mucho hoy en día.
    // Por ejemplo puedo tomar datos de un listado de autos de Mercado Libre y aplicarle técnicas de scraping para poder utilizar el código en mi propia web.


    

    getProductsFromAirtable();

    //inicialización
    renderProducts(listProducts);        
});