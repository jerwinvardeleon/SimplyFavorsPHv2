const products = [
  { id: 1, name: "Keychain (bottle)", price: 35, category: "keychain", bimg: "img/products/KC_bottle.jpg" },
  { id: 2, name: "Keychain (acrylic)", price: 35, category: "keychain" , bimg: "img/products/KC_acrylic.jpg"},
  { id: 3, name: "Pin (badge)", price: 35, category: "pins", bimg: "img/products/pin.jpg" },
  { id: 4, name: "Baptismal candle", price: 40, category: "candle", bimg: "img/products/bapt.jpg" },
  { id: 5, name: "Card type (alcohol)", price: 45, category: "alcohol", bimg: "img/products/card_alc.jpg" },
  { id: 6, name: "Spray Bottle (alcohol)", price: 40, category: "alcohol", bimg: "img/products/spry_alc.png" },
  { id: 7, name: "Spray Bottle (perfume)", price: 65, category: "perfume", bimg: "img/products/spry_per.png" },
  { id: 8, name: "Keychain (bear)", price: 50, category: "keychain", bimg: "img/products/spry_per.png" },
  { id: 9, name: "Omni Hand Sanitizer", price: 55, category: "sanitizer" , bimg: "img/products/sani.jpg"},
  { id: 10, name: "Omni Hand Sanitizer (Organza Pouch)", price: 65, category: "sanitizer", bimg: "img/products/sani_org.jpg" },
  { id: 11, name: "Omni Hand Sanitizer (Burlap Pouch)", price: 70, category: "sanitizer", bimg: "img/products/sani_bur.jpg" },
  { id: 12, name: "Wet wipes in can", price: 65, category: "keychain", bimg: "img/products/wipe.jpg" },
  { id: 13, name: "Bear (pouch)", price: 80, category: "bear", bimg: "img/products/bear.png" },
  { id: 14, name: "Bear (bottle)", price: 100, category: "bear", bimg: "img/products/bearb.jpg" },
  { id: 15, name: "Bear w/ Sanitizer", price: 150, category: "bear", bimg: "img/products/bearh.jpg" },
  { id: 16, name: "Bear w/ Mug", price: 185, category: "bear", bimg: "img/products/bearm.jpg" },
  { id: 17, name: "Safari Plush Toy", price: 100, category: "bear", bimg: "img/products/safari.jpg" },
  { id: 17, name: "Safari Plush Toy (pouch)", price: 120, category: "bear", bimg: "img/products/safarip.png" },
  { id: 18, name: "Safari Plush Toy (acetate box)", price: 150, category: "bear", bimg: "img/products/safaria.png" },
  { id: 19, name: "Safari Plush Toy w/ Mug", price: 180, category: "bear", bimg: "img/products/safarim.png" },
  { id: 20, name: "Mini Scented bubble candle", price: 50, category: "candle", bimg: "img/products/cand.jpeg" },
  { id: 21, name: "Spray Bottle - Gold (perfume)", price: 55, category: "perfume", bimg: "img/products/perfg.jpg" },
  { id: 22, name: "Scented Candle", price: 65, category: "candle", bimg: "img/products/scncand.jpeg" },
  { id: 22, name: "Keychain (perfume)", price: 55, category: "keychain", bimg: "img/products/KC_ess.png" },

  { id: 71, name: "Spray Bottle (perfume)", price: 65, category: "spray bottle", bimg: "img/products/spry_per.png" },
  { id: 61, name: "Spray Bottle (alcohol)", price: 40, category: "spray bottle", bimg: "img/products/spry_alc.png" },
  { id: 211, name: "Spray Bottle - Gold (perfume)", price: 55, category: "spray bottle", bimg: "img/products/perfg.jpg" }
];

let cart = [];
let currentFilter = "All";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filtersContainer = document.getElementById("filters");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Setting up filter per category..............
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

// Price filter variables
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const priceFilterBtn = document.getElementById("priceFilterBtn");

let minPrice = null;
let maxPrice = null;

if (priceFilterBtn) {
  priceFilterBtn.addEventListener("click", () => {
    minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : null;
    maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : null;
    renderProducts();
  });
}

function renderProducts() {
  productsContainer.innerHTML = "";
  const searchText = searchInput.value.toLowerCase();

  const filtered = products.filter(p => {
    const matchesCategory = (currentFilter === "All" || p.category === currentFilter);
    const matchesSearch = p.name.toLowerCase().includes(searchText);
    const matchesMin = minPrice === null || p.price >= minPrice;
    const matchesMax = maxPrice === null || p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesMin && matchesMax;
  });

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div style="height:353px;background-image: url(${product.bimg});background-size: cover;background-repeat: no-repeat;border-radius:15px; max-width=353px" ; >
      </div>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <strong>₱ ${product.price}</strong><br><br>
      <button onclick="addToCart(${product.id})">Add</button>
    `;

    productsContainer.appendChild(card);
  });
}

// Setting up filter per amount..............










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
