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

        const figure = document.createElement("figure");

        const image = document.createElement("img");

        image.src = work.imageUrl;

        image.alt = work.title;

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

        // image
        const image = document.createElement("img");

        image.src = work.imageUrl;

        image.alt = work.title;

        figure.appendChild(image);

        // delete button
        if (token) {

            const deleteButton = document.createElement("button");

            deleteButton.innerHTML = "🗑️";

            deleteButton.classList.add("delete-button");

            deleteButton.addEventListener("click", async () => {

                const response = await fetch(
                    `http://localhost:5678/api/works/${work.id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {

                    getWorks();
                }
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

    const response = await fetch("http://localhost:5678/api/categories");

    const categories = await response.json();

    displayFilters(categories);

    displayCategoryOptions(categories);
}

function displayFilters(categories) {

    const filters = document.querySelector(".filters");

    filters.innerHTML = "";

    // bouton Tous
   const allButton = document.createElement("button");

allButton.innerText = "Tous";

allButton.classList.add("active");
   allButton.addEventListener("click", () => {

    document
        .querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));

    allButton.classList.add("active");

    displayWorks(allWorks);
});
    filters.appendChild(allButton);

    // catégories
    categories.forEach(category => {

        const button = document.createElement("button");

        button.innerText = category.name;

        button.addEventListener("click", () => {

            const filteredWorks = allWorks.filter(work =>
                work.categoryId === category.id
            );

            displayWorks(filteredWorks);
        });

        filters.appendChild(button);
    });
}

// =========================
// CATEGORY OPTIONS
// =========================

function displayCategoryOptions(categories) {

    const select = document.getElementById("category");

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category.id;

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

    // banner
    const banner = document.getElementById("edit-banner");

    banner.style.display = "flex";

    // logout
    const loginLink = document.getElementById("login-link");

    loginLink.innerHTML = `<a href="#">logout</a>`;

    loginLink.addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.reload();
    });

    // hide filters
    const filters = document.querySelector(".filters");

    filters.style.display = "none";

    // show edit button
    const editButton = document.getElementById("edit-button");

    editButton.style.display = "block";
}

// =========================
// MODAL
// =========================

const modal = document.getElementById("modal");

const editButton = document.getElementById("edit-button");

const closeModal = document.getElementById("close-modal");

editButton.addEventListener("click", () => {

    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";
});

// =========================
// ADD PHOTO FORM
// =========================

const addPhotoButton = document.getElementById("add-photo-button");

const addPhotoForm = document.getElementById("add-photo-form");

const modalGallery = document.querySelector(".modal-gallery");

addPhotoButton.addEventListener("click", () => {

    // cacher galerie
    modalGallery.style.display = "none";

    addPhotoButton.style.display = "none";

    // afficher formulaire
    addPhotoForm.style.display = "flex";
});
addPhotoForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // récupération données
    const image = document.getElementById("image").files[0];

    const title = document.getElementById("title").value;

    const category = document.getElementById("category").value;

    // FormData
    const formData = new FormData();

    formData.append("image", image);

    formData.append("title", title);

    formData.append("category", category);

    // POST API
    const response = await fetch("http://localhost:5678/api/works", {

        method: "POST",

        headers: {
            Authorization: `Bearer ${token}`
        },

        body: formData
    });

    if (response.ok) {

        // refresh works
        getWorks();

        // reset form
        addPhotoForm.reset();

        // retour galerie
        addPhotoForm.style.display = "none";

        modalGallery.style.display = "grid";

        addPhotoButton.style.display = "block";
    }
});