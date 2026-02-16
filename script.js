const products = [
  { id: 1, name: "Wipes in can", price: 5, category: "Accessories", bimg: "img/products/wipes.jpg" },
  { id: 2, name: "Pastel Tote Bag", price: 15, category: "Bags" },
  { id: 3, name: "Mini Plushie", price: 12, category: "Toys" },
  { id: 4, name: "Sticker Pack", price: 4, category: "Stationery" },
  { id: 5, name: "Souvenir Mug", price: 10, category: "Home" }
];

let cart = [];
let currentFilter = "All";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filtersContainer = document.getElementById("filters");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const categories = ["All", ...new Set(products.map(p => p.category))];

function renderFilters() {
  filtersContainer.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === currentFilter) btn.classList.add("active");
    btn.onclick = () => {
      currentFilter = cat;
      renderProducts();
      renderFilters();
    };
    filtersContainer.appendChild(btn);
  });
}

function renderProducts() {
  productsContainer.innerHTML = "";
  const searchText = searchInput.value.toLowerCase();

  const filtered = products.filter(p =>
    (currentFilter === "All" || p.category === currentFilter) &&
    p.name.toLowerCase().includes(searchText)
  );

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div style="height:190px;background-image: url(${product.bimg});background-size: contain;background-repeat: no-repeat;border-radius:15px;"></div>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <strong>₱ ${product.price}</strong><br><br>
      <button onclick="addToCart(${product.id})">Add</button>
    `;

    productsContainer.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function updateCart() {
  cartCount.textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total;
}

searchInput.addEventListener("input", renderProducts);

renderFilters();
renderProducts();
