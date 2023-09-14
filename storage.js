// Initialize data from localStorage or use an empty array
let data = JSON.parse(localStorage.getItem('prods')) || [];
let editMode = false; // New variable to track edit mode

document.addEventListener("DOMContentLoaded", function () {
    const showProdBtn = document.getElementById("showProdBtn");
    const addProdBtn = document.getElementById("addProdBtn");
    const prodForm = document.getElementById("prodForm");
    const data_table = document.querySelector(".data_table");

    showProdBtn.addEventListener("click", readAll);
    addProdBtn.addEventListener("click", showAddProdForm);
    prodForm.addEventListener("submit", handleSubmit);

    function showAddProdForm() {
        document.querySelector(".create_form").style.display = "block";
        prodForm.reset();
        editMode = false; // Set to false when adding a new prod
    }

    function addProd(id, name, quantity, price) {
        const newProd = { id, name, quantity, price };
        data.push(newProd);
        saveToLocalStorage(data);
        readAll();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("prodName").value;
        const quantity = parseInt(document.getElementById("prodQuantity").value);
        const price = parseFloat(document.getElementById("prodPrice").value);

        if (name && !isNaN(quantity) && !isNaN(price)) {
            if (editMode) {
                const id = parseInt(document.getElementById("prodId").value);
                updateProd(id, name, quantity, price);
                editMode = false; // Exit edit mode
            } else {
                const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
                addProd(id, name, quantity, price);
            }

            prodForm.reset();
            document.querySelector(".create_form").style.display = "none";
        }
    }

    function readAll() {
        const objectdata = getDataFromLocalStorage();
        let elements = "";

        objectdata.forEach(record => {
            elements += `
                <tr>
                    <td>${record.name}</td>
                    <td>${record.quantity}</td>
                    <td>${record.price}</td>
                    <td><button class="edit" data-id="${record.id}">Edit</button></td>
                    <td><button class="delete" data-id="${record.id}">Delete</button></td>
                </tr>`;
        });

        data_table.innerHTML = elements;

        // Add event listeners for delete using event delegation
        data_table.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', handleDelete);
        });

        // Add event listeners for edit using event delegation
        data_table.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
    }

    function handleEdit(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const prodIndex = data.findIndex(rec => rec.id === id);
    
        if (prodIndex !== -1) {
            const prodNameInput = document.getElementById("prodName");
            const prodQuantityInput = document.getElementById("prodQuantity");
            const prodPriceInput = document.getElementById("prodPrice");
    
            if (prodNameInput && prodQuantityInput && prodPriceInput) {
                const updatedName = prodNameInput.value;
                const updatedQuantity = parseInt(prodQuantityInput.value);
                const updatedPrice = parseFloat(prodPriceInput.value);
    
                if (updatedName && !isNaN(updatedQuantity) && !isNaN(updatedPrice)) {
                    // Update the prod in the data array
                    data[prodIndex].name = updatedName;
                    data[prodIndex].quantity = updatedQuantity;
                    data[prodIndex].price = updatedPrice;
                    saveToLocalStorage(data);
    
                    // Clear the form and exit edit mode
                    prodNameInput.value = "";
                    prodQuantityInput.value = "";
                    prodPriceInput.value = "";
                    editMode = false;
    
                    // Refresh the prod list
                    readAll();
                } else {
                    console.error("Invalid input for editing prod.");
                }
            } else {
                console.error("One or more form elements not found.");
            }
        }
    }
    

    function handleDelete(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        data = data.filter(rec => rec.id !== id);
        saveToLocalStorage(data);
        readAll();
    }

    function updateProd(id, name, quantity, price) {
        const index = data.findIndex(rec => rec.id === id);
        if (index !== -1) {
            data[index] = { id, name, quantity, price };
            saveToLocalStorage(data);
            readAll();
        }
    }

    function saveToLocalStorage(data) {
        localStorage.setItem("prods", JSON.stringify(data));
    }

    function getDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('prods')) || [];
    }

    // Initialize the page by reading existing data from localStorage
    readAll();
});
