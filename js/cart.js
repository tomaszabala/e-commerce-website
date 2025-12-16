document.addEventListener("DOMContentLoaded", () => {
    
    // Estado del carrito
    let cart = [];

    // Elementos del DOM
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');

    // Cargar carrito desde localStorage al inicio
    function loadCart() {
        const savedCart = localStorage.getItem('winesbay-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        return cart;
    }

    // Guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('winesbay-cart', JSON.stringify(cart));
        updateCartCount(); // Actualizar el contador del header
    }

    // Agregar producto al carrito
    function addToCart(product) {
        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.find(item => item.recordId === product.recordId);
        
        if (existingProduct) {
            // Si existe, aumentar cantidad
            existingProduct.quantity += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            cart.push({
                recordId: product.recordId,
                name: product.name,
                price: product.price,
                category: product.category,
                img: product.img,
                quantity: 1
            });
        }
        
        saveCart();
        showAddedToast(product.name); 
    }

    // Eliminar producto del carrito
    function removeFromCart(recordId) {
        cart = cart.filter(item => item.recordId !== recordId);
        saveCart();
        renderCart();
    }

    // Actualizar cantidad de un producto
    function updateQuantity(recordId, newQuantity) {
        const product = cart.find(item => item.recordId === recordId);
        
        if (product) {
            if (newQuantity <= 0) {
                removeFromCart(recordId);
            } else {
                product.quantity = newQuantity;
                saveCart();
                renderCart();
            }
        }
    }

    // Calcular subtotal
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Renderizar carrito
    function renderCart() {
        if (!cartItemsContainer) return; // Si no estamos en cart.html, salir

        // Si el carrito está vacío
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega productos para comenzar tu compra</p>
                    <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #722f37; color: white; text-decoration: none; border-radius: 6px;">
                        Ver productos
                    </a>
                </div>
            `;
            renderSummary();
            return;
        }

        // Renderizar productos
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItemsContainer.appendChild(cartItem);
        });

        // Renderizar resumen
        renderSummary();
    }

    // Crear elemento de producto en el carrito
    function createCartItem(item) {
        const article = document.createElement('article');
        article.setAttribute('class', 'cart-item');

        article.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="info">
                <h3 class="name">${item.name}</h3>
                <p class="meta">Botella 750ml · ${item.category}</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" data-action="decrease" data-id="${item.recordId}">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.recordId}">+</button>
            </div>
            <div class="price">$${(item.price * item.quantity).toLocaleString('es-AR')}</div>
            <button class="btn-remove" data-id="${item.recordId}">Eliminar item</button>
        `;

        return article;
    }

    // Renderizar resumen
    function renderSummary() {
        if (!cartSummary) return;

        const subtotal = calculateSubtotal();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        cartSummary.innerHTML = `
            <h2>Resumen</h2>
            <div class="summary-row"><span>Productos (${totalItems})</span><span>$${subtotal.toLocaleString('es-AR')}</span></div>
            <div class="summary-row"><span>Envío</span><span>A calcular</span></div>
            <div class="summary-row total"><span>Total</span><span>$${subtotal.toLocaleString('es-AR')}</span></div>
            <button class="btn-primary" id="btn-checkout">Finalizar compra</button>
        `;

        // Event para finalizar compra
        const btnCheckout = document.getElementById('btn-checkout');
        if (btnCheckout) {
            btnCheckout.addEventListener('click', handleCheckout);
        }
    }

    // Manejar finalizar compra
    function handleCheckout() {
        if (cart.length === 0) {
            showToast('Tu carrito está vacío', 'error');
            return;
        }

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = calculateSubtotal();

        showCheckoutToast(totalItems, total);

        // Vaciar carrito después de un delay
        setTimeout(() => {
            cart = [];
            saveCart();
            renderCart();
        }, 2000);
    }

    // Mostrar toast de "Agregado al carrito"
    function showAddedToast(productName) {
        const existingToast = document.querySelector('.add-to-cart-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.setAttribute('class', 'add-to-cart-toast');
        toast.innerHTML = `
            <span>✓ ${productName} agregado al carrito</span>
            <a href="cart.html">Ver carrito</a>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Actualizar contador del carrito en el header
    function updateCartCount() {
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

    // Delegación de eventos para los botones del carrito
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            // Botones de cantidad
            if (event.target.classList.contains('qty-btn')) {
                const recordId = event.target.getAttribute('data-id');
                const action = event.target.getAttribute('data-action');
                const product = cart.find(item => item.recordId === recordId);
                
                if (product) {
                    const newQuantity = action === 'increase' 
                        ? product.quantity + 1 
                        : product.quantity - 1;
                    updateQuantity(recordId, newQuantity);
                }
            }

            // Botón eliminar
            if (event.target.classList.contains('btn-remove')) {
                const recordId = event.target.getAttribute('data-id');
                const product = cart.find(item => item.recordId === recordId);
                
                if (product) {
                    createRemoveToast(recordId, product.name);
                }
            }
        });
    }

    // Inicializar
    loadCart();
    updateCartCount();
    
    // Si estamos en cart.html, renderizar
    if (cartItemsContainer) {
        renderCart();
    }

    // Mostrar toast genérico
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.setAttribute('class', `toast-notification toast-${type}`);

        toast.innerHTML = `<span class="toast-message">${message}</span>`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Mostrar toast de confirmación de eliminación
    function createRemoveToast(recordId, productName) {
        const overlay = document.createElement('div');
        overlay.setAttribute('class', 'delete-overlay');

        const toast = document.createElement('div');
        toast.setAttribute('class', 'delete-toast');

        toast.innerHTML = `
            <div class="toast-icon">🗑️</div>
            <h3 class="toast-title">¿Eliminar producto?</h3>
            <p class="toast-message">¿Estás seguro de que quieres eliminar "${productName}" del carrito?</p>
            <div class="toast-buttons">
                <button class="btn-toast-cancel">Cancelar</button>
                <button class="btn-toast-delete">Eliminar</button>
            </div>
        `;

        overlay.appendChild(toast);
        document.body.appendChild(overlay);

        // Event para cancelar
        toast.querySelector('.btn-toast-cancel').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Event para cerrar al hacer click fuera
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Event para eliminar
        toast.querySelector('.btn-toast-delete').addEventListener('click', () => {
            removeFromCart(recordId);
            document.body.removeChild(overlay);
            showToast(`${productName} eliminado del carrito`, 'success');
        });
    }

    // Mostrar toast de confirmación de compra
    function showCheckoutToast(totalItems, total) {
        const existingToast = document.querySelector('.checkout-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.setAttribute('class', 'checkout-toast');

        toast.innerHTML = `
            <div class="checkout-toast-icon">✓</div>
            <h3>¡Gracias por tu compra!</h3>
            <div class="checkout-details">
                <p><strong>Productos:</strong> ${totalItems}</p>
                <p><strong>Total:</strong> $${total.toLocaleString('es-AR')}</p>
            </div>
            <p class="checkout-message">En breve recibirás un email con los detalles.</p>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

});