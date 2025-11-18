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


    // Edition form
    
    function createEditForm(product) {
        const newDivOverlay = document.createElement('div');
        newDivOverlay.setAttribute('class', 'edit-overlay');

        // Create form
        const newDivForm = document.createElement('div');
        newDivForm.setAttribute('class', 'edit-form');

        // Título del formulario
        const formTitle = document.createElement('h2');
        formTitle.setAttribute('class', 'form-title');
        formTitle.innerText = 'Editar Producto';

        // Crear el formulario
        const editForm = document.createElement('form');
        editForm.setAttribute('id', 'form-edit-product');

        // Form-Name
        const divName = document.createElement('div');
        divName.setAttribute('class', 'form-group-sections');

        const labelName = document.createElement('label');
        labelName.setAttribute('class', 'form-label');
        labelName.innerText = 'Nombre:';

        const inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('id', 'edit-name');
        inputName.setAttribute('class', 'form-input');
        inputName.setAttribute('value', product.name);

        divName.appendChild(labelName);
        divName.appendChild(inputName);

        // Form-Price
        const divPrice = document.createElement('div');
        divPrice.setAttribute('class', 'form-group-sections');

        const labelPrice = document.createElement('label');
        labelPrice.setAttribute('class', 'form-label');
        labelPrice.innerText = 'Precio:';

        const inputPrice = document.createElement('input');
        inputPrice.setAttribute('type', 'number');
        inputPrice.setAttribute('id', 'edit-price');
        inputPrice.setAttribute('class', 'form-input');
        inputPrice.setAttribute('value', product.price);

        divPrice.appendChild(labelPrice);
        divPrice.appendChild(inputPrice);

        // Form-Categories
        const divCategory = document.createElement('div');
        divCategory.setAttribute('class', 'form-group-sections');

        const labelCategory = document.createElement('label');
        labelCategory.setAttribute('class', 'form-label');
        labelCategory.innerText = 'Categoría:';

        const selectCategory = document.createElement('select');
        selectCategory.setAttribute('id', 'edit-category');
        selectCategory.setAttribute('class', 'form-select');

        // Crear opciones del select
        const categories = ['Malbec', 'Syrah', 'Cabernet', 'Chardonnay'];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.setAttribute('value', category);
            option.innerText = category;

            // Marcar como selected si coincide con la categoría del producto
            if (category === product.category) {
                option.setAttribute('selected', '');
            }

            selectCategory.appendChild(option);
        });

        divCategory.appendChild(labelCategory);
        divCategory.appendChild(selectCategory);

        // Form-Image
        const divImg = document.createElement('div');
        divImg.setAttribute('class', 'form-group-sections');

        const labelImg = document.createElement('label');
        labelImg.setAttribute('class', 'form-label');
        labelImg.innerText = 'URL de Imagen:';

        const inputImg = document.createElement('input');
        inputImg.setAttribute('type', 'text');
        inputImg.setAttribute('id', 'edit-img');
        inputImg.setAttribute('class', 'form-input');
        inputImg.setAttribute('value', product.img);
        divImg.appendChild(labelImg);
        divImg.appendChild(inputImg);

        // Form-buttons
        const divButtons = document.createElement('div');
        divButtons.setAttribute('class', 'form-buttons');

        const btnCancel = document.createElement('button');
        btnCancel.setAttribute('type', 'button');
        btnCancel.setAttribute('id', 'btn-cancel-edit');
        btnCancel.setAttribute('class', 'btn-cancel');
        btnCancel.innerText = 'Cancelar';

        const btnSubmit = document.createElement('button');
        btnSubmit.setAttribute('type', 'submit');
        btnSubmit.setAttribute('class', 'btn-submit');
        btnSubmit.innerText = 'Guardar Cambios';

        divButtons.appendChild(btnCancel);
        divButtons.appendChild(btnSubmit);

        // Assembling form
        editForm.appendChild(divName);
        editForm.appendChild(divPrice);
        editForm.appendChild(divCategory);
        editForm.appendChild(divImg);
        editForm.appendChild(divButtons);
        newDivForm.appendChild(formTitle);
        newDivForm.appendChild(editForm);
        newDivOverlay.appendChild(newDivForm);
        document.body.appendChild(newDivOverlay);


        // Event para cerrar el form
        const btnCancelEdit = document.getElementById('btn-cancel-edit');
        btnCancelEdit.addEventListener('click', () => {
            document.body.removeChild(newDivOverlay);
        });

        // Cerrar al hacer click fuera del form
        newDivOverlay.addEventListener('click', (event) => {
            if (event.target === newDivOverlay) {
                document.body.removeChild(newDivOverlay);
            }
        });

        // Event listener para el formulario
        const form = document.getElementById('form-edit-product');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedProduct = {
                name: document.getElementById('edit-name').value,
                price: document.getElementById('edit-price').value, 
                category: document.getElementById('edit-category').value,
                img: document.getElementById('edit-img').value
            };

            // Llamar a la función de edición
            await editProductInAirtable(product.id, updatedProduct);
            
            // Cerrar el form
            document.body.removeChild(newDivOverlay);
            
            // Recargar los productos
            await getProductsFromAirtable();
        });
    }


    // events
    
    adminContainer.addEventListener('click', (event) => {
        // Si se hace click en el botón editar
        if (event.target.classList.contains('btn-edit')) {
            const productId = event.target.getAttribute('id');
            const product = listProducts.map(product => product.id === productId);
            
            if (product) {
                createEditForm(product);
            } else {
                console.error('Producto no encontrado');
            }
        }
        
        // Si se hace click en el botón eliminar
        if (event.target.classList.contains('btn-delete')) {
            const productId = event.target.getAttribute('id');
            const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este producto?'); // no supe que opcion utilizar para una mejor interfaz
            
            if (confirmDelete) {
                deleteProductInAirtable(productId);
            }
        }
    });


    async function editProductInAirtable (product) {
        try {
            const response = await fetch(airtableUrl, {
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

    async function deleteProductInAirtable(productId) {
        try {
            const response = await fetch(`${airtableUrl}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`
                }
            });
            
            if (response.ok) {  // la propiedad .ok contiene un booleano que indica si la respuesta tiene status 200 (successful) o no.
                console.log('Producto eliminado exitosamente');
                await getProductsFromAirtable(); // Recargar productos
            }
        } catch (error) {
            console.error('Error deleting product in Airtable:', error);
        }
    }

    //inicialización
    getProductsFromAirtable();

});