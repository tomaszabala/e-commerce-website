import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

document.addEventListener("DOMContentLoaded", () => {
    
    // dom elements
    const adminContainer = document.getElementById("admin-products");

    //data Airtable
    const API_TOKEN = AIRTABLE_TOKEN;
    const baseId = BASE_ID;
    const tableName = TABLE_NAME;
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    // estado global
    let listProducts = [];

    // Reutilizo la función createProduct, pero la modifico para admin
    function createAdminCard(product) {
        const newProductCard = document.createElement("div");
        newProductCard.setAttribute('class', 'product-card');

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

        const newDivBtn = document.createElement('div');
        newDivBtn.setAttribute('class', 'admin-buttons');

        const newBtnEdit = document.createElement('button');
        newBtnEdit.setAttribute('class', 'btn-edit');
        newBtnEdit.setAttribute('type', 'submit')
        newBtnEdit.setAttribute('id', product.id);
        newBtnEdit.innerText = 'Editar';

        const newBtnDelete = document.createElement('button');
        newBtnDelete.setAttribute('class', 'btn-delete');
        newBtnDelete.setAttribute('id', product.id);
        newBtnDelete.innerText = 'Eliminar';

        newDiv.appendChild(newImg);
        newDiv.appendChild(newProductName);
        newDiv.appendChild(newProductCategory);
        newDiv.appendChild(newProductPrice);
        newDivBtn.appendChild(newBtnEdit);
        newDivBtn.appendChild(newBtnDelete);
        newDiv.appendChild(newDivBtn);
        newProductCard.appendChild(newDiv);

        return newProductCard;
    }

    function renderProducts(products) {
        adminContainer.innerHTML = ''; // limpio el contenedor antes de agregar los productos filtrados, para que no queden productos de busquedas anteriores
        products.forEach( product => {
            const newProductCard = createAdminCard(product);
            adminContainer.appendChild(newProductCard);
        });
    }

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


    // Edition form
    
    function createEditForm(product) {
        const newDivOverlay = document.createElement('div');
        newDivOverlay.setAttribute('class', 'edit-overlay');

        // Crear modal con el formulario
        const newDivForm = document.createElement('div');
        newDivForm.setAttribute('class', 'edit-form');
        modal.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #333;">Editar Producto</h2>
            <form id="form-edit-product">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre:</label>
                    <input 
                        type="text" 
                        id="edit-name" 
                        value="${product.name}" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                    >
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Precio:</label>
                    <input 
                        type="number" 
                        id="edit-price" 
                        value="${product.price}" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                    >
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Categoría:</label>
                    <select 
                        id="edit-category" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                    >
                        <option value="Malbec" ${product.category === 'Malbec' ? 'selected' : ''}>Malbec</option>
                        <option value="Syrah" ${product.category === 'Syrah' ? 'selected' : ''}>Syrah</option>
                        <option value="Cabernet" ${product.category === 'Cabernet' ? 'selected' : ''}>Cabernet</option>
                        <option value="Chardonnay" ${product.category === 'Chardonnay' ? 'selected' : ''}>Chardonnay</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">URL de Imagen:</label>
                    <input 
                        type="text" 
                        id="edit-img" 
                        value="${product.img}" 
                        required
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                    >
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button 
                        type="button" 
                        id="btn-cancel-edit"
                        style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        style="padding: 10px 20px; background: #8B1538; color: white; border: none; border-radius: 4px; cursor: pointer;"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        `;

        newDivOverlay.appendChild(newDivForm);
        document.body.appendChild(newDivOverlay);

        // Event para cerrar el form
        const btnCancel = newDivForm.querySelector('#btn-cancel-edit');
        btnCancel.addEventListener('click', () => {
            document.body.removeChild(newDivOverlay);
        });

        // Cerrar al hacer click fuera del form
        newDivOverlay.addEventListener('click', (event) => {
            if (event.target === newDivOverlay) {
                document.body.removeChild(newDivOverlay);
            }
        });

        // Event listener para el formulario
        const form = modal.querySelector('#form-edit-product');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedProduct = {
                name: document.getElementById('edit-name').value,
                price: parseFloat(document.getElementById('edit-price').value),
                category: document.getElementById('edit-category').value,
                img: document.getElementById('edit-img').value
            };

            // Llamar a la función de edición
            await editProductInAirtable(product.id, updatedProduct);
            
            // Cerrar el modal
            document.body.removeChild(overlay);
            
            // Recargar los productos
            await getProductsFromAirtable();
        });
    }


    // events
    
    adminContainer.addEventListener('click', (event) => {
        // Si se hace click en el botón editar
        if (event.target.classList.contains('btn-edit')) {
            const productId = event.target.getAttribute('data-id');
            const product = listProducts.find(product => product.id === productId);
            
            if (product) {
                createEditForm(product);
            } else {
                console.error('Producto no encontrado');
            }
        }
        
        // Si se hace click en el botón eliminar
        if (event.target.classList.contains('btn-delete')) {
            const productId = event.target.getAttribute('data-id');
            const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este producto?');
            
            if (confirmDelete) {
                deleteProductInAirtable(productId);
            }
        }
    });


    async function editProductInAirtable (product) {
        try {
            const response = await fetch(`${airtableUrl}/${product.id}`, {
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



});