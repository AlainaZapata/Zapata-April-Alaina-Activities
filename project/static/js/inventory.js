   // Function to fetch products from the backend with optional category filter
   async function fetchProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const url = categoryFilter ? `/api/products?category=${categoryFilter}` : '/api/products';

    const res = await fetch(url);
    const products = await res.json();
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';
    products.forEach(p => {
        tableBody.innerHTML += `
            <tr class="hover:bg-pink-50">
                <td class="p-4">${p.id}</td>
                <td class="p-4">${p.name}</td>
                <td class="p-4">${p.price}</td>
                <td class="p-4">${p.quantity}</td>
                <td class="p-4">${p.category}</td>
                <td class="p-4 space-x-2">
<button onclick="editProduct(${p.id})" class="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-300 transition">Edit</button>
<button onclick="deleteProduct(${p.id})" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition">Delete</button>
</td>
</tr>`;
    });
}

// Function to add a new product
async function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const category = document.getElementById('category').value;

    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, quantity, category })
    });

    document.getElementById('productForm').reset();
    fetchProducts();
}

// Function to delete a product
async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    }
}

// Logout function
async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.href = "/";
}

// Initial call to fetch products
fetchProducts();
let editingProductId = null;

// Called when clicking the Edit button
function editProduct(id) {
fetch(`/api/products/${id}`)
.then(res => res.json())
.then(product => {
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('category').value = product.category;
    editingProductId = id;

    // Change button text to "Update"
    const btn = document.querySelector('#productForm button[type="submit"]');
    btn.textContent = "Update Product";
    btn.classList.remove("bg-pink-500", "hover:bg-pink-400");
    btn.classList.add("bg-yellow-500", "hover:bg-yellow-400");

    // Show cancel button
    document.getElementById("cancelEditBtn").classList.remove("hidden");
});
}

// Update addProduct to also handle update mode
async function addProduct(event) {
event.preventDefault();
const name = document.getElementById('name').value;
const price = document.getElementById('price').value;
const quantity = document.getElementById('quantity').value;
const category = document.getElementById('category').value;

const payload = JSON.stringify({ name, price, quantity, category });

if (editingProductId) {
await fetch(`/api/products/${editingProductId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: payload
});
} else {
await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
});
}

document.getElementById('productForm').reset();
resetFormState();
fetchProducts();
}

function resetFormState() {
editingProductId = null;
const btn = document.querySelector('#productForm button[type="submit"]');
btn.textContent = "Add Product";
btn.classList.remove("bg-yellow-500", "hover:bg-yellow-400");
btn.classList.add("bg-pink-500", "hover:bg-pink-400");
document.getElementById("cancelEditBtn").classList.add("hidden");
}
