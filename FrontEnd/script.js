const token = localStorage.getItem("token");
let allWorks = [];

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
  works.forEach((work) => {
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

function displayModalWorks(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    figure.appendChild(image);
    if (token) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "🗑️";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", async () => {
        const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) getWorks();
      });
      figure.appendChild(deleteButton);
    }
    modalGallery.appendChild(figure);
  });
}

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
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
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerText = category.name;
    button.addEventListener("click", () => {
      displayWorks(allWorks.filter((w) => w.categoryId === category.id));
    });
    filters.appendChild(button);
  });
}

function displayCategoryOptions(categories) {

  const select = document.getElementById("category");

  select.innerHTML = `
    <option value="" selected disabled hidden></option>
  `;

  categories.forEach((category) => {

    const option = document.createElement("option");

    option.value = category.id;
    option.innerText = category.name;

    select.appendChild(option);
  });
}
getWorks();
getCategories();

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

const modal = document.getElementById("modal");
const editButton = document.getElementById("edit-button");
const closeModal = document.getElementById("close-modal");
const addPhotoButton = document.getElementById("add-photo-button");
const addPhotoForm = document.getElementById("add-photo-form");
const modalGallery = document.querySelector(".modal-gallery");
const gallerySeparator = document.querySelector(".separator");
const backModal = document.getElementById("back-modal");
const modalTitle = document.getElementById("modal-title");

const validateButton = document.querySelector(
  "#add-photo-form button[type='submit']",
);

// Gris par défaut
validateButton.disabled = true;

function checkForm() {
  const image = document.getElementById("image").files[0];
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;

  validateButton.disabled = !(image && title && category);
}

document.getElementById("image").addEventListener("change", checkForm);
document.getElementById("title").addEventListener("input", checkForm);
document.getElementById("category").addEventListener("change", checkForm);

function goToGallery() {
  modalTitle.innerText = "Galerie photo";
  backModal.style.display = "none";
  addPhotoForm.style.display = "none";
  modalGallery.style.display = "grid";
  gallerySeparator.style.display = "block";
  addPhotoButton.style.display = "block";
  validateButton.disabled = true;
}

function goToForm() {
  modalTitle.innerText = "Ajout photo";
  backModal.style.display = "block";
  modalGallery.style.display = "none";
  gallerySeparator.style.display = "none";
  addPhotoButton.style.display = "none";
  addPhotoForm.style.display = "flex";
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

backModal.addEventListener("click", () => {
  addPhotoForm.reset();
  resetPreview();
  goToGallery();
});

addPhotoForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const image = document.getElementById("image").files[0];
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;

  // Vérification des champs
  if (!image || !title || !category) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  const formData = new FormData();

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  const response = await fetch("http://localhost:5678/api/works", {

    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`
    },

    body: formData
  });

  if (response.ok) {

    await getWorks();

    addPhotoForm.reset();

    resetPreview();

    goToGallery();
  }
});
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("preview-image");
const uploadButton = document.querySelector(".upload-button");
const uploadText = document.querySelector(".image-preview p");

//  Cacher le texte et le bouton quand une photo est sélectionnée
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    document.getElementById("preview-placeholder").style.display = "none";
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
    previewImage.style.opacity = "1";
    uploadButton.style.display = "none";
    uploadText.style.display = "none";
  }
});
//  Réafficher le texte et le bouton lors du reset
function resetPreview() {
  document.getElementById("preview-placeholder").style.display = "block";
  previewImage.style.display = "none";
  previewImage.src = "";
  uploadButton.style.display = "flex";
  uploadText.style.display = "block";
}
