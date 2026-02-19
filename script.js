const products = [
  { id: 1, name: "Keychain (bottle)", price: 35, category: "keychain", bimg: "img/products/KC_bottle.jpg" },
  { id: 2, name: "Keychain (acrylic)", price: 35, category: "keychain" , bimg: "img/products/KC_acrylic.jpg"},
  { id: 3, name: "Pin (badge)", price: 35, category: "pins", bimg: "img/products/pin.jpg" },
  { id: 4, name: "Baptismal candle", price: 40, category: "candle" , bimg: "img/products/bapt.jpg"},
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
// const categories = ["All", "Bags","Toys"];

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
      <div style="height:246px;background-image: url(${product.bimg});background-size: contain;background-repeat: no-repeat;border-radius:15px;"></div>
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
