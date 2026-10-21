
const API = "https://koracraft-backend.onrender.com";

const table = document.getElementById("requestsTable");

const totalRequests = document.getElementById("totalRequests");
const newRequests = document.getElementById("newRequests");
const contactedRequests = document.getElementById("contactedRequests");
const completedRequests = document.getElementById("completedRequests");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const requestModal = document.getElementById("requestModal");
const closeModal = document.getElementById("closeModal");

let requests = [];

// ======================================
// Check Login Session
// ======================================

async function checkSession() {
    try {
        const response = await fetch(`${API}/api/auth/check`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Session check failed: HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.loggedIn) {
            window.location.href = "login.html";
            return false;
        }

        return true;
    } catch (err) {
        console.error("Session check error:", err);
        alert("Could not verify your login session. Check the Console.");
        return false;
    }
}

// ======================================
// Load Requests
// ======================================

async function loadRequests() {
    try {
        const response = await fetch(`${API}/api/request`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Failed to load requests: HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.requests)) {
            throw new Error("The API did not return a valid requests array.");
        }

        requests = result.requests;

        updateStatistics();
        renderTable();

        console.log(`Loaded ${requests.length} requests from the API.`);
    } catch (err) {
        console.error("Load requests error:", err);
        alert("Could not load requests. Open F12 > Console for details.");
    }
}

// ======================================
// Statistics
// ======================================

function updateStatistics() {
    totalRequests.textContent = requests.length;

    newRequests.textContent =
        requests.filter(r => (r.status || "New") === "New").length;

    contactedRequests.textContent =
        requests.filter(r => r.status === "Contacted").length;

    completedRequests.textContent =
        requests.filter(r => r.status === "Completed").length;
}

// ======================================
// Render Table
// ======================================

function renderTable() {
    table.innerHTML = "";

    const search = searchInput.value.toLowerCase().trim();
    const status = statusFilter.value;

    const filtered = requests.filter(r => {
        const matchesSearch =
            (r.full_name || "").toLowerCase().includes(search) ||
            (r.email || "").toLowerCase().includes(search) ||
            (r.website_type || "").toLowerCase().includes(search);

        const matchesStatus =
            status === "All" ||
            (status === "New" ? (r.status || "New") === "New" : r.status === status);

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = requests.length === 0
            ? "No requests were returned by the API."
            : "No requests match your search or selected status.";

        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    filtered.forEach(request => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${request.id}</td>
            <td></td>
            <td></td>
            <td></td>
            <td><span class="status"></span></td>
            <td></td>
            <td><button class="delete-btn" data-id="${request.id}">Delete</button></td>
        `;

        // Use textContent for customer-provided values.
        row.cells[1].textContent = request.full_name || "N/A";
        row.cells[2].textContent = request.email || "N/A";
        row.cells[3].textContent = request.website_type || "N/A";
        row.cells[4].firstElementChild.textContent = request.status || "New";
        row.cells[5].textContent = request.created_at
            ? new Date(request.created_at).toLocaleDateString()
            : "N/A";

        row.addEventListener("click", () => openRequest(request));

        row.querySelector(".delete-btn").addEventListener("click", event => {
            event.stopPropagation();
            deleteRequest(request.id);
        });

        table.appendChild(row);
    });
}

// ======================================
// Request Details Modal
// ======================================

function openRequest(request) {
    document.getElementById("modalRequestId").textContent =
        `Request #${request.id}`;

    document.getElementById("modalName").textContent =
        request.full_name || "N/A";

    document.getElementById("modalCompany").textContent =
        request.company_name || "N/A";

    document.getElementById("modalEmail").textContent =
        request.email || "N/A";

    document.getElementById("modalPhone").textContent =
        request.phone || "N/A";

    document.getElementById("modalWebsite").textContent =
        request.website_type || "N/A";

    document.getElementById("modalBudget").textContent =
        request.budget || "N/A";

    document.getElementById("modalTimeline").textContent =
        request.timeline || "N/A";

    document.getElementById("modalStatus").textContent =
        request.status || "New";

    document.getElementById("modalDescription").textContent =
        request.project_description || "No description provided.";

    document.getElementById("modalDate").textContent =
        request.created_at
            ? new Date(request.created_at).toLocaleString()
            : "N/A";

    requestModal.classList.add("active");
}

closeModal.addEventListener("click", () => {
    requestModal.classList.remove("active");
});

requestModal.addEventListener("click", event => {
    if (event.target === requestModal) {
        requestModal.classList.remove("active");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        requestModal.classList.remove("active");
    }
});

// ======================================
// Delete Request
// ======================================

async function deleteRequest(id) {
    if (!confirm("Delete this request?")) return;

    try {
        const response = await fetch(`${API}/api/request/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Delete failed: HTTP ${response.status}`);
        }

        await loadRequests();
    } catch (err) {
        console.error("Delete request error:", err);
        alert("Could not delete the request. Check the Console.");
    }
}

// ======================================
// Logout
// ======================================

document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await fetch(`${API}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        });
    } catch (err) {
        console.error("Logout error:", err);
    }

    window.location.href = "login.html";
});

// ======================================
// Search and Filter
// ======================================

searchInput.addEventListener("input", renderTable);
statusFilter.addEventListener("change", renderTable);

// ======================================
// Start Dashboard
// ======================================

(async () => {
    const loggedIn = await checkSession();

    if (loggedIn) {
        await loadRequests();
    }
})();
