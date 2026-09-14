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

    const response = await fetch(
        "https://koracraft-backend.onrender.com/api/auth/check",
        {
            credentials: "include"
        }
    );

    const result = await response.json();

    if (!result.loggedIn) {

        window.location.href = "login.html";

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
                credentials: "include"
            }
        );

        if (!response.ok) {

            alert("Failed to load requests.");

            return;

        }

        const result = await response.json();

        requests = result.requests;

        updateStatistics();

        renderTable();

    }

    catch(err){

        console.error(err);

    }

}

// ======================================
// Statistics
// ======================================

function updateStatistics(){

    totalRequests.textContent = requests.length;

    newRequests.textContent =
        requests.filter(r=>r.status==="New").length;

    contactedRequests.textContent =
        requests.filter(r=>r.status==="Contacted").length;

    completedRequests.textContent =
        requests.filter(r=>r.status==="Completed").length;

}

// ======================================
// Render Table
// ======================================

function renderTable(){

    table.innerHTML="";

    const search =
        searchInput.value.toLowerCase();

    const status =
        statusFilter.value;

    const filtered = requests.filter(r=>{

        const matchesSearch =

            (r.full_name || "").toLowerCase().includes(search) ||

            (r.email || "").toLowerCase().includes(search) ||

            (r.website_type || "").toLowerCase().includes(search);

        const matchesStatus =

            status==="All" ||

            r.status===status;

        return matchesSearch && matchesStatus;

    });
    };

    // ======================================
// Request Details Modal
// ======================================

const requestModal = document.getElementById("requestModal");
const closeModal = document.getElementById("closeModal");

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


// Close button

closeModal.addEventListener("click", () => {
    requestModal.classList.remove("active");
});


// Click outside modal to close

requestModal.addEventListener("click", (e) => {

    if (e.target === requestModal) {
        requestModal.classList.remove("active");
    }

});


// ESC key closes modal

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        requestModal.classList.remove("active");
    }

});

filtered.forEach(request => {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${request.id}</td>

        <td>${request.full_name || "N/A"}</td>

        <td>${request.email || "N/A"}</td>

        <td>${request.website_type || "N/A"}</td>

        <td>
            <span class="status">
                ${request.status || "New"}
            </span>
        </td>

        <td>
            ${new Date(request.created_at).toLocaleDateString()}
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
    // Whole row opens request
    // ======================================

    row.addEventListener("click", () => {
        openRequest(request);
    });

    // ======================================
    // Delete button
    // ======================================

    row.querySelector(".delete-btn").addEventListener("click", (e) => {

        // Prevent the row click from opening the request
        e.stopPropagation();

        deleteRequest(request.id);

    });

    table.appendChild(row);

});


// ======================================
// Delete
// ======================================

async function deleteRequest(id){

    if(!confirm("Delete this request?")) return;

    const response = await fetch(

        `https://koracraft-backend.onrender.com/api/request/${id}`,

        {

            method:"DELETE",

            credentials:"include"

        }

    );

    if(response.ok){

        loadRequests();

    }

}

// ======================================
// Logout
// ======================================

document
.getElementById("logoutBtn")
.addEventListener("click",async()=>{

    await fetch(

        "https://koracraft-backend.onrender.com/api/auth/logout",

        {

            method:"POST",

            credentials:"include"

        }

    );

    window.location.href="login.html";

});

// ======================================
// Search
// ======================================

searchInput.addEventListener(

    "input",

    renderTable

);

// ======================================
// Filter
// ======================================

statusFilter.addEventListener(

    "change",

    renderTable

);

// ======================================
// Start
// ======================================

(async()=>{

    await checkSession();

    await loadRequests();

})();
