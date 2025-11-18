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

    function editedProduct(product) {
        if (product.addEventListener('click', (event) =>{
            event.newBtnEdit.value === typeof ('submit')
        })) {
            editProductInAirtable({
                Name: product.name,
                Price: product.price,
                Category: product.category,
                Img: product.img
            });
        };
    }

    editedProduct();

});