const DEFAULT_ONEDRIVE_LINK = "";

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

function getErrorMessage(error) {
  if (!error) {
    return "Unable to load the workbook. Ensure the file is shared as Anyone with the link can view.";
  }

  const message = String(error.message || error);

  if (message.startsWith("OneDrive API error")) {
    return `${message}. Verify the file is shared publicly and the link is valid.`;
  }

  if (message.includes("No worksheets found")) {
    return "Workbook loaded but no worksheets were found. Check that the file contains at least one worksheet.";
  }

  return "Unable to load the workbook. Ensure the file is shared as Anyone with the link can view.";
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
    const contentType = (response.headers.get("content-type") || "").toLowerCase();

    if (!response.ok) {
      const bodyText = await response.text();
      const preview = bodyText.slice(0, 300).replace(/\s+/g, " ");
      throw new Error(`OneDrive API error ${response.status} ${response.statusText}: ${preview}`);
    }

    if (contentType.includes("text/html")) {
      const bodyText = await response.clone().text();
      const preview = bodyText.slice(0, 300).replace(/\s+/g, " ");
      throw new Error(`OneDrive returned HTML instead of a workbook. This usually means the link is not a direct shared file URL or access is blocked. Preview: ${preview}`);
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
    console.error("Workbook loading failed:", error);
    setStatus(getErrorMessage(error), "error");
  }
}

if (sourceLinkInput) {
  sourceLinkInput.value = DEFAULT_ONEDRIVE_LINK;
}

if (loadBtn) {
  loadBtn.addEventListener("click", () => loadFromOneDrive(sourceLinkInput.value));
}

if (DEFAULT_ONEDRIVE_LINK) {
  loadFromOneDrive(DEFAULT_ONEDRIVE_LINK);
}
