let products = [];
let categories = ["All"];
const productsDataPath = "products.csv";
const BESTSELLER_RIBBON = "img/icon/BestSellingv3.gif";

let currentFilter = "All";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filtersContainer = document.getElementById("filters");


// FILTER PER CATEGORY SECTION
// FILTER PER CATEGORY SECTION
// FILTER PER CATEGORY SECTION
function parseCsvLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];
      if (insideQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === ',' && !insideQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current);
  return values;
}

function parseProductsCsv(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));

    return {
      id: Number(row.id),
      name: row.name,
      price: Number(row.price),
      category: row.category,
      bimg: row.bimg,
      bestseller: String(row.bestseller || "").trim().toLowerCase() === "yes"
    };
  });
}

function updateCategories() {
  categories = ["All", ...new Set(products.map(product => product.category))];
}

function ensureDefaultFilter() {
  currentFilter = categories.includes("All") ? "All" : (categories[0] || "All");
}

function renderFilters() {
  if (!filtersContainer) return;
  filtersContainer.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat.toLowerCase() === "wipes") {
      btn.classList.add("wipes-highlight");
    }
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
  if (!productsContainer || !searchInput) return;
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
    card.className = product.bestseller ? "card bestseller-card" : "card";
    const ribbonHtml = product.bestseller
      ? `<img class="bestseller-ribbon" src="${BESTSELLER_RIBBON}" alt="Best Selling">`
      : "";

    card.innerHTML = `
      ${ribbonHtml}
      <div class="card-image" style="
        position: relative;
        height:154px;
        background-image: url(${product.bimg});
        background-size: cover;
        background-repeat: no-repeat;
        border-radius:15px;
        max-width=154px" ; >
      </div>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <strong>₱ ${product.price}</strong><br><br>
      <button onclick="showPopup('popup-best-selling.html', {name: '${product.name}', price: '${product.price}', category: '${product.category}', bimg: '${product.bimg}'})">Get an estimate</button>
    `;

    productsContainer.appendChild(card);
  });
}

// function renderBestSelling() {
//   const bestSelling = document.getElementById("bestSelling");
//   if (!bestSelling) return;

//   bestSelling.innerHTML = "";
//   const product = products.find(p => p.id === 12);
//   if (!product) return;

//   const card = document.createElement("div");
//   card.className = "bestSelling";
//   card.innerHTML = `
//       <div style="
//           height:320px;
//           background-image: url(${product.bimg});
//           background-size: cover;
//           background-repeat: no-repeat;
//           border-radius:15px; 
//           max-width=353px";
//           >
//       </div>
//       <h3 style="position: relative; top: -320px; left: 20px; font-style: oblique; color: #5a3e36;">${product.name}</h3>
//       <h2 style="position: relative; top: -345px; left: 20px; font-style: oblique; color: #5a3e36;" >₱ ${product.price}</h2><br><br>
//       <button 
//         onmouseover="this.style.color='#f3ebde';this.style.backgroundColor='#5a3e36'; this.style.transform='scale(1.05)';"
//         onmouseout="this.style.color='#5a3e36';this.style.backgroundColor='var(--cream)'; this.style.transform='scale(1)';"
//         style="
//           transition: background-color 0.3s ease, transform 0.3s ease;
//           background-color: var(--cream);
//           border-color: transparent;
//           border-width: 2px;
//           border-style: solid;
//           font-size: 22px;
//           font-weight: lighter;
//           font-family: inherit;
//           position: relative;
//           top: -200px;
//           left: 0px;
//           width: 100%;
//           height: 35px;
//           "
//         onclick="showPopup('popup-best-selling.html', {name: '${product.name}', price: '${product.price}', category: '${product.category}', bimg: '${product.bimg}'})">
//         Click here to order !!!
//       </button>
//     `;
//   bestSelling.appendChild(card);
// }

async function loadProducts() {
  try {
    const response = await fetch(productsDataPath, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${productsDataPath}`);
    }

    const csvText = await response.text();
    products = parseProductsCsv(csvText);
    updateCategories();
    ensureDefaultFilter();
    renderFilters();
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    if (productsContainer) {
      productsContainer.innerHTML = "<p>Unable to load products right now.</p>";
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

loadProducts();

// BEST SELLING PRODUCT DISPLAY
// BEST SELLING PRODUCT DISPLAY
// BEST SELLING PRODUCT DISPLAY

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
