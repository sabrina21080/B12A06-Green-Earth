const API_BASE = "https://openapi.programming-hero.com/api";

const categoryList = document.getElementById("category-list");
const productList = document.getElementById("product-list");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("tree-modal");
const closeModalBtn = document.getElementById("close-modal");

// Modal fields
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDescription = document.getElementById("modal-description");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");

let cart = [];
let total = 0;

/* =========================
   Fetch Categories
========================= */
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    const categories = data.categories || [];

    // "All Trees" option
    const allLi = document.createElement("li");
    allLi.innerHTML = `
      <button class="w-full text-left px-4 py-2 rounded-md bg-green-600 text-white">
        All Trees
      </button>`;
    allLi.querySelector("button").addEventListener("click", loadAllPlants);
    categoryList.appendChild(allLi);

    // Category buttons
    categories.forEach(cat => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button class="w-full text-left px-4 py-2 rounded-md hover:bg-green-100">
          ${cat.category_name}
        </button>`;
      li.querySelector("button").addEventListener("click", () => loadPlantsByCategory(cat.id));
      categoryList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

/* =========================
   Fetch All Plants
========================= */
async function loadAllPlants() {
  try {
    const res = await fetch(`${API_BASE}/plants`);
    const data = await res.json();
    displayPlants(data.plants || []);
  } catch (err) {
    console.error("Error loading plants:", err);
  }
}

/* =========================
   Fetch Plants by Category
========================= */
async function loadPlantsByCategory(id) {
  try {
    const res = await fetch(`${API_BASE}/category/${id}`);
    const data = await res.json();
    displayPlants(data.plants || []);
  } catch (err) {
    console.error("Error loading category plants:", err);
  }
}

/* =========================
   Display Plants
========================= */
function displayPlants(plants) {
  productList.innerHTML = "";

  plants.forEach(tree => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-xl shadow";

    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.plant_name}" class="w-full h-32 object-cover rounded mb-4">
      <h3 class="font-semibold text-green-700 cursor-pointer hover:underline">
        ${tree.plant_name}
      </h3>
      <p class="text-sm text-gray-600">${tree.description?.substring(0, 50) || ""}...</p>
      <span class="text-xs inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 rounded">
        ${tree.category_name || "Tree"}
      </span>
      <div class="flex justify-between items-center mt-4">
        <span class="font-semibold">৳${tree.price || 0}</span>
        <button class="add-to-cart bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Add to Cart
        </button>
      </div>
    `;

    // Open modal on tree name click
    card.querySelector("h3").addEventListener("click", () => loadPlantDetail(tree.id));

    // Add to cart
    card.querySelector(".add-to-cart").addEventListener("click", () => addToCart(tree));

    productList.appendChild(card);
  });
}

/* =========================
   Fetch Plant Detail
========================= */
async function loadPlantDetail(id) {
  try {
    const res = await fetch(`${API_BASE}/plant/${id}`);
    const data = await res.json();
    const tree = data.plant;

    modalImage.src = tree.image;
    modalName.textContent = tree.plant_name;
    modalDescription.textContent = tree.description;
    modalCategory.textContent = tree.category_name;
    modalPrice.textContent = tree.price;

    modal.classList.remove("hidden");
  } catch (err) {
    console.error("Error loading plant detail:", err);
  }
}

// Close modal
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

/* =========================
   Cart Functions
========================= */
function addToCart(tree) {
  cart.push(tree);
  total += tree.price || 0;
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white p-2 rounded shadow";
    li.innerHTML = `
      <span>${item.plant_name} ৳${item.price || 0}</span>
      <button data-index="${index}" class="remove-item text-red-500 font-bold">×</button>
    `;
    cartItemsContainer.appendChild(li);
  });

  cartTotal.textContent = "৳" + total;
}

// Event delegation for remove buttons
cartItemsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("remove-item")) {
    const index = parseInt(e.target.dataset.index, 10);
    total -= cart[index].price || 0;
    cart.splice(index, 1);
    updateCart();
  }
});

/* =========================
   Init
========================= */
loadCategories();
loadAllPlants();

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.toggle("hidden");
});




     