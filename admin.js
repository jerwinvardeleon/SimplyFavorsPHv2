const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "simplyfavors2026";
const CSV_PATH = "products.csv";

const loginPanel = document.getElementById("loginPanel");
const editorPanel = document.getElementById("editorPanel");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const saveMessage = document.getElementById("saveMessage");
const table = document.getElementById("csvTable");

const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

let csvHeaders = [];
let csvRows = [];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });

  return { headers, rows };
}

function escapeCsvValue(value) {
  const raw = String(value ?? "");
  if (raw.includes('"') || raw.includes(",") || raw.includes("\n") || raw.includes("\r")) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function toCsv(headers, rows) {
  const headerLine = headers.map(escapeCsvValue).join(",");
  const rowLines = rows.map(row => headers.map(header => escapeCsvValue(row[header])).join(","));
  return [headerLine, ...rowLines].join("\n");
}

function renderTable() {
  if (!csvHeaders.length) {
    table.innerHTML = "";
    return;
  }

  const theadCells = csvHeaders.map(header => `<th>${header}</th>`).join("");

  const bodyRows = csvRows.map((row, rowIndex) => {
    const cells = csvHeaders.map(header => {
      const cellValue = row[header] ?? "";
      const safeValue = String(cellValue)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");

      return `<td><input data-row="${rowIndex}" data-col="${header}" value="${safeValue}"></td>`;
    }).join("");

    return `<tr>${cells}<td class="row-actions"><button type="button" data-delete-row="${rowIndex}">Delete</button></td></tr>`;
  }).join("");

  table.innerHTML = `
    <thead>
      <tr>${theadCells}<th class="row-actions">Actions</th></tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  `;
}

async function loadCsv() {
  saveMessage.textContent = "Loading products.csv...";
  saveMessage.classList.remove("ok");

  const response = await fetch(CSV_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load products.csv");
  }

  const csvText = await response.text();
  const parsed = parseCsv(csvText);
  csvHeaders = parsed.headers;
  csvRows = parsed.rows;
  renderTable();

  saveMessage.textContent = "products.csv loaded.";
  saveMessage.classList.add("ok");
}

function addEmptyRow() {
  if (!csvHeaders.length) return;

  const row = {};
  csvHeaders.forEach(header => {
    row[header] = "";
  });

  csvRows.push(row);
  renderTable();
}

function removeRow(index) {
  csvRows = csvRows.filter((_, rowIndex) => rowIndex !== index);
  renderTable();
}

async function saveCsv() {
  const csvText = toCsv(csvHeaders, csvRows);

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "products.csv",
        types: [
          {
            description: "CSV Files",
            accept: { "text/csv": [".csv"] }
          }
        ]
      });

      const writable = await handle.createWritable();
      await writable.write(csvText);
      await writable.close();

      saveMessage.textContent = "Saved successfully.";
      saveMessage.classList.add("ok");
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        saveMessage.textContent = "Save canceled.";
        saveMessage.classList.remove("ok");
        return;
      }
    }
  }

  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "products.csv";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  saveMessage.textContent = "Downloaded products.csv. Replace your project file with this downloaded copy.";
  saveMessage.classList.remove("ok");
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  loginMessage.textContent = "";

  const formData = new FormData(loginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    loginMessage.textContent = "Invalid username or password.";
    return;
  }

  loginPanel.classList.add("hidden");
  editorPanel.classList.remove("hidden");

  try {
    await loadCsv();
  } catch (error) {
    saveMessage.textContent = "Failed to load CSV. Make sure products.csv is accessible.";
    saveMessage.classList.remove("ok");
  }
});

addRowBtn.addEventListener("click", addEmptyRow);
saveBtn.addEventListener("click", saveCsv);
logoutBtn.addEventListener("click", () => {
  loginForm.reset();
  loginPanel.classList.remove("hidden");
  editorPanel.classList.add("hidden");
  loginMessage.textContent = "";
  saveMessage.textContent = "";
});

table.addEventListener("input", event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const rowIndex = Number(target.getAttribute("data-row"));
  const column = target.getAttribute("data-col");

  if (!Number.isInteger(rowIndex) || rowIndex < 0 || !column) return;
  if (!csvRows[rowIndex]) return;

  csvRows[rowIndex][column] = target.value;
});

table.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const rowToDelete = target.getAttribute("data-delete-row");
  if (rowToDelete === null) return;

  removeRow(Number(rowToDelete));
});
