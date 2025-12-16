import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from 'env.js';

document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar cartCounter al cargar la página
    updateCartCounter();
    
    // Data Airtable
    const API_TOKEN = AIRTABLE_TOKEN;
    const baseId = BASE_ID;
    const tableName = TABLE_NAME;
    
    // Función para obtener el parámetro 'code' de la URL
    function getProductCodeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('code');
    }
    
    // Función para obtener un producto específico desde Airtable
    async function fetchProductById(productId) {
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${productId}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error('Error al cargar el producto:', response.status);
            return null;
        }
        
        const data = await response.json();
        return data;
    }
    
    // Función para formatear precio
    function formatPrice(price) {
        if (!price) return '0';
        return price.toLocaleString('es-AR');
    }
    
    // Función para renderizar el detalle del producto
    function renderProductDetail(productData) {
        const container = document.querySelector('.product-detail .container');

        if (!productData) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>Producto no encontrado</h2>
                    <p>El producto que buscas no existe o no está disponible.</p>
                    <a href="index.html" class="btn-primary">Volver al inicio</a>
                </div>`;
            return;
        }
        
        const product = {
            recordId: productData.id,
            name: productData.fields.Name,
            price: productData.fields.Price,
            img: productData.fields.Img_Detail,
            category: productData.fields.Category,
            description: productData.fields.Description || 'Sin descripción disponible.',
            bodega: productData.fields.Bodega || 'N/A',
            origen: productData.fields.Origen || 'N/A',
            cosecha: productData.fields.Cosecha || 'N/A',
            alcohol: productData.fields.Alcohol || 'N/A'
        };
        
        
        // Actualizar título de la página
        document.title = `${product.name} - WinesBay`;
        
        // Crear toda la estructura HTML
        container.innerHTML = `
            <nav class="pd-route-link">
                <a href="index.html">Inicio > ${product.name}</a> 
            </nav>

            <section class="pd-layout">
              <div class="pd-card pd-media">
                  <img src="${product.img || './img/img-product.jpg'}" alt="${product.name}">
              </div>
          
              <div class="pd-card pd-info">
                  <h1 class="pd-title">${product.name}</h1>
                  <p class="pd-meta">Botella 750ml, ${product.category}</p>
                  <p class="pd-desc">${product.description}</p>
              
                  <ul class="pd-info-list">
                      <li><p><strong>Bodega:</strong> ${product.bodega}</p></li>
                      <li><p><strong>Origen:</strong> ${product.origen}</p></li>
                      <li><p><strong>Cosecha:</strong> ${product.cosecha}</p></li>
                      <li><p><strong>Alcohol:</strong> ${product.alcohol}</p></li>
                  </ul>
              
                  <div class="pd-price-row">
                      <span class="pd-price">$${formatPrice(product.price)}</span>
                
                      <label class="pd-qty">
                        Cantidad
                        <input type="number" min="1" value="1">
                      </label>
                  </div>
              
                  <div class="pd-actions">
                      <a href="#" class="btn-primary">Añadir al carrito</a>
                      <a href="index.html" class="btn-ghost">Volver al inicio</a>
                  </div>
              </div>
            </section>
        `;
        
        // Configurar funcionalidad del botón "Añadir al carrito"
        setupAddToCart(product);
    }
    
    // Función para configurar el botón de añadir al carrito
    function setupAddToCart(product) {
        const addToCartBtn = document.querySelector('.btn-primary');
        const quantityInput = document.querySelector('.pd-qty input');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                addToCart(product, quantity);
                showAddToCartMessage();
                
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1500);
            });
        }
    }
    
    // Función para añadir al carrito
    function addToCart(product, quantity = 1) {
        let cart = [];
        
        const savedCart = localStorage.getItem('winesbay-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        const existingProduct = cart.find(item => item.recordId === product.recordId);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                recordId: product.recordId,
                name: product.name,
                price: product.price,
                category: product.category,
                img: product.img,
                quantity: quantity
            });
        }
        
        localStorage.setItem('winesbay-cart', JSON.stringify(cart));
        updateCartCounter();
        
        console.log(`${product.name} agregado al carrito (cantidad: ${quantity})`);
    }
    
    // Función para actualizar el contador del carrito
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
    
    // Función para mostrar mensaje de confirmación
    function showAddToCartMessage() {
        const message = document.createElement('div');
        message.className = 'cart-notification';
        message.textContent = '¡Producto añadido al carrito!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('cart-notification-hide');
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 300);
        }, 1200);
    }
    
    // Inicializar la página de detalle
    async function initProductDetail() {
        const productId = getProductCodeFromURL();
        
        if (!productId) {
            window.location.href = 'index.html';
            return;
        }
        
        const productData = await fetchProductById(productId);
        renderProductDetail(productData);
    }
    
    initProductDetail();
});