const DEFAULT_ONEDRIVE_LINK = "https://1drv.ms/x/c/7e2d5127cf0c5ecc/IQC4vTnk5iH8Q7RxUKc2ALNTAQXOkI-y6XliPZHDjQgM-D8?e=tbhraB";

const sourceLinkInput = document.getElementById("sourceLink");
const loadBtn = document.getElementById("loadBtn");
const statusText = document.getElementById("status");
const excelTable = document.getElementById("excelTable");

function setStatus(message, state = "") {
  statusText.textContent = message;
  statusText.classList.remove("error", "ok");
  if (state) statusText.classList.add(state);
}

function shareLinkToApiUrl(shareLink) {
  const encoded = btoa(unescape(encodeURIComponent(shareLink)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `https://api.onedrive.com/v1.0/shares/u!${encoded}/root/content`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTable(rows) {
  excelTable.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    setStatus("No rows found in the first worksheet.", "error");
    return;
  }

  const firstRow = rows[0] || [];
  const colCount = rows.reduce((max, row) => Math.max(max, row.length), firstRow.length);
  const headerCells = Array.from({ length: colCount }, (_, index) => {
    const label = firstRow[index] ?? `Column ${index + 1}`;
    return `<th>${escapeHtml(label)}</th>`;
  }).join("");

  const bodyRows = rows.slice(1).map(row => {
    const cells = Array.from({ length: colCount }, (_, index) => `<td>${escapeHtml(row[index] ?? "")}</td>`).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  excelTable.innerHTML = `
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  `;

  setStatus(`Loaded ${rows.length - 1} rows from worksheet.`, "ok");
}

async function loadFromOneDrive(shareLink) {
  const trimmedLink = String(shareLink || "").trim();
  if (!trimmedLink) {
    setStatus("Please provide a OneDrive share link.", "error");
    return;
  }

  setStatus("Loading workbook...");

  try {
    const apiUrl = shareLinkToApiUrl(trimmedLink);
    const response = await fetch(apiUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`OneDrive API error ${response.status}`);
    }

    const fileBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: "array" });

    if (!workbook.SheetNames.length) {
      throw new Error("No worksheets found.");
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, {
      header: 1,
      blankrows: false,
      defval: ""
    });

    renderTable(rows);
  } catch (error) {
    console.error(error);
    setStatus("Unable to load the workbook. Ensure the file is shared as Anyone with the link can view.", "error");
  }
}

if (sourceLinkInput) {
  sourceLinkInput.value = DEFAULT_ONEDRIVE_LINK;
}

if (loadBtn) {
  loadBtn.addEventListener("click", () => loadFromOneDrive(sourceLinkInput.value));
}

loadFromOneDrive(DEFAULT_ONEDRIVE_LINK);
