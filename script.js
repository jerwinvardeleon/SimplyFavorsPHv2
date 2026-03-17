const products = [
  { id: 1, name: "Keychain (bottle)", price: 35, category: "keychain", bimg: "img/products/KC_bottle.jpg" },
  { id: 2, name: "Keychain (acrylic)", price: 35, category: "keychain", bimg: "img/products/KC_acrylic.jpg" },
  { id: 3, name: "Pin (badge)", price: 35, category: "pins", bimg: "img/products/pin.jpg" },
  { id: 4, name: "Baptismal candle", price: 40, category: "candle", bimg: "img/products/bapt.jpg" },
  { id: 5, name: "Card type (alcohol)", price: 45, category: "alcohol", bimg: "img/products/card_alc.jpg" },
  { id: 6, name: "Spray Bottle (alcohol)", price: 40, category: "alcohol", bimg: "img/products/spry_alc.png" },
  { id: 7, name: "Spray Bottle (perfume)", price: 65, category: "perfume", bimg: "img/products/spry_per.png" },
  { id: 8, name: "Keychain (bear)", price: 50, category: "keychain", bimg: "img/products/spry_per.png" },
  { id: 9, name: "Omni Hand Sanitizer", price: 55, category: "sanitizer", bimg: "img/products/sani.jpg" },
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
  // additional category filter
  { id: 71, name: "Spray Bottle (perfume)", price: 65, category: "spray bottle", bimg: "img/products/spry_per.png" },
  { id: 61, name: "Spray Bottle (alcohol)", price: 40, category: "spray bottle", bimg: "img/products/spry_alc.png" },
  { id: 211, name: "Spray Bottle - Gold (perfume)", price: 55, category: "spray bottle", bimg: "img/products/perfg.jpg" }
];

let currentFilter = "All";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filtersContainer = document.getElementById("filters");


// FILTER PER CATEGORY SECTION
// FILTER PER CATEGORY SECTION
// FILTER PER CATEGORY SECTION
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

// PRICE FILTER SECTION
// PRICE FILTER SECTION
// PRICE FILTER SECTION
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


// PRODUCT RENDERING SECTION
// PRODUCT RENDERING SECTION
// PRODUCT RENDERING SECTION
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
      <div style="
        height:353px;
        background-image: url(${product.bimg});
        background-size: cover;
        background-repeat: no-repeat;
        border-radius:15px; max-width=353px" ; >
      </div>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <strong>₱ ${product.price}</strong><br><br>
      <button onclick="showPopup('popup-best-selling.html', {name: '${product.name}', price: '${product.price}', category: '${product.category}', bimg: '${product.bimg}'})">Get an estimate</button>
    `;

    productsContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", renderProducts);

renderFilters();
renderProducts();

// BEST SELLING PRODUCT DISPLAY
// BEST SELLING PRODUCT DISPLAY
// BEST SELLING PRODUCT DISPLAY
document.addEventListener("DOMContentLoaded", () => {
  const bestSelling = document.getElementById("bestSelling");
  const product = products.find(p => p.id === 12);
  if (product && bestSelling) {
    const card = document.createElement("div");
    card.className = "bestSelling";
    card.innerHTML = `
      <div style="
          height:320px;
          background-image: url(${product.bimg});
          background-size: cover;
          background-repeat: no-repeat;
          border-radius:15px; 
          max-width=353px";
          >
      </div>
      <h3 style="position: relative; top: -320px; left: 20px; font-style: oblique; color: #5a3e36;">${product.name}</h3>
      <h2 style="position: relative; top: -345px; left: 20px; font-style: oblique; color: #5a3e36;" >₱ ${product.price}</h2><br><br>
      <button 
        onmouseover="this.style.color='#f3ebde';this.style.backgroundColor='#5a3e36'; this.style.transform='scale(1.05)';"
        onmouseout="this.style.color='#5a3e36';this.style.backgroundColor='#f3ebde'; this.style.transform='scale(1)';"
        style="
          transition: background-color 0.3s ease, transform 0.3s ease;
          background-color: transparent;
          border-color: transparent;
          border-width: 2px;
          border-style: solid;
          font-size: 22px;
          font-family: fantasy;
          position: relative;
          top: -200px;
          left: 0px;
          width: 100%;
          height: 35px;
          "
        onclick="showPopup('popup-best-selling.html', {name: '${product.name}', price: '${product.price}', category: '${product.category}', bimg: '${product.bimg}'})">
        Click here to order !!!
      </button>
    `;
    bestSelling.appendChild(card);
  }
});

// Creates a centered popup overlay (300x300) with provided HTML content or file path.
// If htmlOrFilePath ends with .html, it's treated as a file path and fetched.
// Optional data object for template variable replacement (${variable}).
async function createPopup(htmlOrFilePath = "", data = {}) {
  // Prevent multiple overlays
  if (document.querySelector('.overlay')) return;

  let htmlContent = htmlOrFilePath;

  // If it looks like a file path (ends with .html), fetch it
  if (htmlOrFilePath.endsWith('.html')) {
    try {
      const response = await fetch(htmlOrFilePath);
      if (!response.ok) throw new Error(`Failed to load ${htmlOrFilePath}`);
      htmlContent = await response.text();
    } catch (error) {
      console.error('Error loading popup file:', error);
      htmlContent = '<p>Error loading content</p>';
    }
  }

  // Replace template variables like ${property} with values from data object
  if (Object.keys(data).length > 0) {
    htmlContent = htmlContent.replace(/\$\{(\w+)\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const popup = document.createElement('div');
  popup.className = 'popup';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'popup-close';
  closeBtn.innerText = '×';
  closeBtn.onclick = () => confirmClose(overlay);

  const content = document.createElement('div');
  content.className = 'popup-content';
  content.innerHTML = htmlContent;

  // execute any inline scripts found in the fetched HTML
  const scripts = content.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    // replace old script with new one so it executes
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  popup.appendChild(closeBtn);
  popup.appendChild(content);
  overlay.appendChild(popup);

  // clicking outside popup closes
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      confirmClose(overlay);
    }
  });

  document.body.appendChild(overlay);
  return { overlay, popup };
}

// Expose a simple helper for console or other code
window.showPopup = (htmlOrPath, data) => createPopup(htmlOrPath, data);

// Function to show confirmation before closing popup
function confirmClose(overlay) {
  // Create confirmation popup
  const confirmOverlay = document.createElement('div');
  confirmOverlay.className = 'confirm-overlay';
  confirmOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
  `;

  const confirmBox = document.createElement('div');
  confirmBox.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
  `;

  confirmBox.innerHTML = `
    <p style="margin: 0 0 20px 0; font-weight: bold;">Are you sure you want to exit?</p>
    <button id="confirm-yes" style="margin-right: 10px; padding: 8px 16px; background: #5a3e36; color: white; border: none; border-radius: 4px; cursor: pointer;">Yes</button>
    <button id="confirm-no" style="padding: 8px 16px; background: #ccc; color: black; border: none; border-radius: 4px; cursor: pointer;">No</button>
  `;

  confirmOverlay.appendChild(confirmBox);
  document.body.appendChild(confirmOverlay);

  // Handle confirmation buttons
  document.getElementById('confirm-yes').onclick = () => {
    document.body.removeChild(confirmOverlay);
    document.body.removeChild(overlay);
  };

  document.getElementById('confirm-no').onclick = () => {
    document.body.removeChild(confirmOverlay);
  };
}
