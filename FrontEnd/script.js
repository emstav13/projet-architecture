const token = localStorage.getItem("token");

let allWorks = [];

// =========================
// WORKS
// =========================

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    allWorks = works;
    displayWorks(works);
    displayModalWorks(works);
}

function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure     = document.createElement("figure");
        const image      = document.createElement("img");
        image.src        = work.imageUrl;
        image.alt        = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// =========================
// MODAL GALLERY
// =========================

function displayModalWorks(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        const image  = document.createElement("img");
        image.src    = work.imageUrl;
        image.alt    = work.title;
        figure.appendChild(image);
        if (token) {
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "🗑️";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", async () => {
                const res = await fetch(
                    `http://localhost:5678/api/works/${work.id}`,
                    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) getWorks();
            });
            figure.appendChild(deleteButton);
        }
        modalGallery.appendChild(figure);
    });
}

// =========================
// CATEGORIES
// =========================

async function getCategories() {
    const response   = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    displayFilters(categories);
    displayCategoryOptions(categories);
}

function displayFilters(categories) {
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.addEventListener("click", () => displayWorks(allWorks));
    filters.appendChild(allButton);
    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerText = category.name;
        button.addEventListener("click", () => {
            displayWorks(allWorks.filter(w => w.categoryId === category.id));
        });
        filters.appendChild(button);
    });
}

function displayCategoryOptions(categories) {
    const select = document.getElementById("category");
    categories.forEach(category => {
        const option    = document.createElement("option");
        option.value    = category.id;
        option.innerText = category.name;
        select.appendChild(option);
    });
}

// =========================
// INIT
// =========================

getWorks();
getCategories();

// =========================
// ADMIN MODE
// =========================

if (token) {
    document.getElementById("edit-banner").style.display = "flex";
    const loginLink = document.getElementById("login-link");
    loginLink.innerHTML = `<a href="#">logout</a>`;
    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.reload();
    });
    document.querySelector(".filters").style.display = "none";
    document.getElementById("edit-button").style.display = "block";
}

// =========================
// ELEMENTS MODAL
// =========================

const modal            = document.getElementById("modal");
const editButton       = document.getElementById("edit-button");
const closeModal       = document.getElementById("close-modal");
const addPhotoButton   = document.getElementById("add-photo-button");
const addPhotoForm     = document.getElementById("add-photo-form");
const modalGallery     = document.querySelector(".modal-gallery");
const gallerySeparator = document.querySelector(".separator");
const backModal        = document.getElementById("back-modal");
const modalTitle       = document.getElementById("modal-title");

// =========================
// NAVIGATION MODALE
// =========================

function goToGallery() {
    modalTitle.innerText             = "Galerie photo";
    backModal.style.display          = "none";
    addPhotoForm.style.display       = "none";
    modalGallery.style.display       = "grid";
    gallerySeparator.style.display   = "block";
    addPhotoButton.style.display     = "block";
}

function goToForm() {
    modalTitle.innerText             = "Ajout photo";
    backModal.style.display          = "block";
    modalGallery.style.display       = "none";
    gallerySeparator.style.display   = "none";
    addPhotoButton.style.display     = "none";
    addPhotoForm.style.display       = "flex";
}

editButton.addEventListener("click", () => {
    modal.style.display = "flex";
    goToGallery();
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    goToGallery();
});

addPhotoButton.addEventListener("click", goToForm);
backModal.addEventListener("click", goToGallery);

// =========================
// SUBMIT FORM
// =========================

addPhotoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const image    = document.getElementById("image").files[0];
    const title    = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const formData = new FormData();
    formData.append("image",    image);
    formData.append("title",    title);
    formData.append("category", category);
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    if (response.ok) {
        await getWorks();
        addPhotoForm.reset();
        goToGallery();
    }
});

// =========================
// NAV LINKS
// =========================

const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");
    });
});
