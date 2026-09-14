const table = document.getElementById("requestsTable");

const totalRequests = document.getElementById("totalRequests");
const newRequests = document.getElementById("newRequests");
const contactedRequests = document.getElementById("contactedRequests");
const completedRequests = document.getElementById("completedRequests");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

let requests = [];

// ======================================
// Check Login Session
// ======================================

async function checkSession() {

    try {

        const response = await fetch(
            "https://koracraft-backend.onrender.com/api/auth/check",
            {
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!result.loggedIn) {
            window.location.href = "login.html";
            return false;
        }

        return true;

    } catch (err) {

        console.error("Session check failed:", err);
        window.location.href = "login.html";
        return false;

    }
}


// ======================================
// Load Requests
// ======================================

async function loadRequests() {

    try {

        const response = await fetch(
            "https://koracraft-backend.onrender.com/api/request",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (response.status === 401) {

            window.location.href = "login.html";
            return;

        }

        if (!response.ok) {

            throw new Error(
                `Failed to load requests. Status: ${response.status}`
            );

        }

        const result = await response.json();

        console.log("Requests received:", result);

        requests = Array.isArray(result.requests)
            ? result.requests
            : [];

        updateStatistics();
        renderTable();

    } catch (err) {

        console.error("Load requests error:", err);

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load requests.
                </td>
            </tr>
        `;

    }

}


// ======================================
// Statistics
// ======================================

function updateStatistics() {

    totalRequests.textContent = requests.length;

    newRequests.textContent =
        requests.filter(
            r => (r.status || "New") === "New"
        ).length;

    contactedRequests.textContent =
        requests.filter(
            r => r.status === "Contacted"
        ).length;

    completedRequests.textContent =
        requests.filter(
            r => r.status === "Completed"
        ).length;

}


// ======================================
// Request Details Modal
// ======================================

const requestModal =
    document.getElementById("requestModal");

const closeModal =
    document.getElementById("closeModal");


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
        request.project_description ||
        "No description provided.";

    document.getElementById("modalDate").textContent =
        request.created_at
            ? new Date(request.created_at).toLocaleString()
            : "N/A";

    requestModal.classList.add("active");

}


// ======================================
// Close Modal
// ======================================

if (closeModal) {

    closeModal.addEventListener("click", () => {

        requestModal.classList.remove("active");

    });

}


// ======================================
// Click Outside Modal
// ======================================

if (requestModal) {

    requestModal.addEventListener("click", (e) => {

        if (e.target === requestModal) {

            requestModal.classList.remove("active");

        }

    });

}


// ======================================
// ESC Key Closes Modal
// ======================================

document.addEventListener("keydown", (e) => {

    if (
        e.key === "Escape" &&
        requestModal
    ) {

        requestModal.classList.remove("active");

    }

});


// ======================================
// Render Table
// ======================================

function renderTable() {

    table.innerHTML = "";

    const search =
        (searchInput.value || "").toLowerCase().trim();

    const status =
        statusFilter.value;

    const filtered = requests.filter(request => {

        const matchesSearch =

            (request.full_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (request.email || "")
                .toLowerCase()
                .includes(search)

            ||

            (request.website_type || "")
                .toLowerCase()
                .includes(search);

        const matchesStatus =

            status === "All" ||

            request.status === status;

        return matchesSearch && matchesStatus;

    });


    // ======================================
    // No Requests
    // ======================================

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No requests found.
                </td>
            </tr>
        `;

        return;

    }


    // ======================================
    // Create Rows
    // ======================================

    filtered.forEach(request => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${request.id}</td>

            <td>
                ${request.full_name || "N/A"}
            </td>

            <td>
                ${request.email || "N/A"}
            </td>

            <td>
                ${request.website_type || "N/A"}
            </td>

            <td>
                <span class="status">
                    ${request.status || "New"}
                </span>
            </td>

            <td>
                ${
                    request.created_at
                        ? new Date(
                            request.created_at
                          ).toLocaleDateString()
                        : "N/A"
                }
            </td>

            <td>
                <button
                    class="delete-btn"
                    data-id="${request.id}">
                    Delete
                </button>
            </td>
        `;


        // ======================================
        // Whole Row Opens Request
        // ======================================

        row.addEventListener("click", () => {

            openRequest(request);

        });


        // ======================================
        // Delete Button
        // ======================================

        const deleteButton =
            row.querySelector(".delete-btn");

        deleteButton.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                deleteRequest(request.id);

            }
        );


        table.appendChild(row);

    });

}


// ======================================
// Delete Request
// ======================================

async function deleteRequest(id) {

    if (!confirm("Delete this request?")) {
        return;
    }

    try {

        const response = await fetch(

            `https://koracraft-backend.onrender.com/api/request/${id}`,

            {
                method: "DELETE",
                credentials: "include"
            }

        );


        if (response.status === 401) {

            window.location.href = "login.html";
            return;

        }


        if (!response.ok) {

            throw new Error(
                `Delete failed: ${response.status}`
            );

        }


        await loadRequests();

    } catch (err) {

        console.error("Delete error:", err);

        alert("Unable to delete this request.");

    }

}


// ======================================
// Logout
// ======================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await fetch(
                    "https://koracraft-backend.onrender.com/api/auth/logout",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

            } catch (err) {

                console.error(
                    "Logout error:",
                    err
                );

            }

            window.location.href = "login.html";

        }
    );

}


// ======================================
// Search
// ======================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderTable
    );

}


// ======================================
// Status Filter
// ======================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderTable
    );

}


// ======================================
// Start Dashboard
// ======================================

(async () => {

    const loggedIn = await checkSession();

    if (!loggedIn) {
        return;
    }

    await loadRequests();

})();