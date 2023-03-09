// Déclaration des chemins vers l'API
const PATH_API = 'http://localhost:5678/api/';
const PATH_WORKS = 'works';
const PATH_CATEGORIES = 'categories';

// Récuperation des données de l'API
const getWorks = () => {
    return fetch( PATH_API + PATH_WORKS , { method: 'GET' })
        .then((response) => response.json())
        .then((datas) => { return datas; })
        .catch((error) => { console.log( error ) });
};
const getCategories = () => {
    return fetch( PATH_API + PATH_CATEGORIES , { method: 'GET' })
        .then((response) => response.json())
        .then((datas) => { return datas; })
        .catch((error) => { console.log( error ) });
};

// Fonction générale
const initialize = async () => {

    // Vérification token user
    checkLogin();

    // Affichage des boutons catégories
    initButtons();
    
    // Affichage des travaux 
    let allWorks = await getWorks();
    generateWorks(allWorks);

};

// Vérification si l'utilisateur est autentifié en tant qu'administrateur
let userLogInToken = window.sessionStorage.getItem('loggedUser');
const checkLogin = () => {

    if (userLogInToken !== null ) {
        userLogInToken = JSON.parse(userLogInToken);
        
        const logInLogOut = document.getElementById("login-logout");
        logInLogOut.innerText = "logout";

        // Afficher le bouton "Modifier"
        document.getElementById('change-works-btn').style.display = null;

        logInLogOut.addEventListener("click", function (event) {
            event.preventDefault();
            window.sessionStorage.removeItem("loggedUser");
            window.location.reload();
        });
    };
};

// Déclaration de fonction qui permet de générer les travaux 
const generateWorks = (allWorks) => {

    if (!allWorks)
        return

    // Sélectionner la div gallerie qui accueillera les travaux
    const portfolioWorks = document.querySelector(".gallery");
    portfolioWorks.innerHTML = "";

    for (let i = 0; i < allWorks.length; i++) {
        const works = allWorks[i];

        // Créer l'élément figure pour les travaux
        let workElement = document.createElement("figure");
            workElement.dataset.id = works.id;

        // Créeer l'image
        const imageElement = document.createElement("img");
            imageElement.src = works.imageUrl;

        // Créer la légende
        const titleElement = document.createElement("figcaption");
            titleElement.innerText = works.title;

        // Rattachement des balises
        portfolioWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
    }
};

// Création de boutons de catégories et filtrage des travaux
const initButtons = async () => {

    // Création de la div conteneur pour les filtres
    const portfolioWorkss = document.querySelector(".gallery");
    const filtersSection = document.createElement("div");
    filtersSection.classList.add("filters-container");
    portfolioWorkss.before(filtersSection);

    // Création du bouton "Tous"
    const buttonAllWorks = document.createElement("button");
        buttonAllWorks.innerText = "Tous";
        buttonAllWorks.classList.add("filters");
        buttonAllWorks.classList.add("active");

    filtersSection.appendChild(buttonAllWorks);

    buttonAllWorks.addEventListener("click", async function() {
        document.querySelector(".gallery").innerHTML = "";
        let allWorks = await getWorks();
        generateWorks(allWorks);
    });

    // Afficher le bouton "enclenché"
    filtersSection.addEventListener("click", function(btn) {
        if (btn.target.classList.contains("active")) {
            return;
        }
        if (document.querySelector(".filters-container button.active") !== null) {
            document.querySelector(".filters-container button.active").classList.remove("active");
        }
        btn.target.classList.add("active")
    });

    // Affichage des catégories et travaux filtrés
    let allButtons = await getCategories();

    if (!allButtons)
        return 

    for (let i = 0; i < allButtons.length; i++) {
        const buttons = allButtons[i];

        let buttonElement = document.createElement("button");
        buttonElement.dataset.id = buttons.id;
        buttonElement.innerText = buttons.name;
        buttonElement.classList.add('filters');
        
        filtersSection.appendChild(buttonElement);

        buttonElement.addEventListener("click", async function() {
            document.querySelector(".gallery").innerHTML = "";

            let allWorks = await getWorks();
            const worksForCategory = allWorks.filter(work => work.category.id == buttonElement.dataset.id);
            generateWorks(worksForCategory);
        });
    };
};

// Création de la fenêtre modale
let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];
// Ouverture de la modale
const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    modal = document.querySelector(target);
    modal.style.display = "";
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    // À chaque ouverture de la modale affichage des travaux (et non pas de la dernière div affichée)
    document.getElementById('modal-wrapper-gallery').style.display = "";
    document.getElementById('modal-wrapper-add-work').style.display = "none";

    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    // Stop propagation sur la modale d'ajout de travaux
    document.getElementById('modal-wrapper-add-work').addEventListener('click', stopPropagation);
    // Affichage dynamique des catégories de travaux sur la modale d'ajout
    categoriesModalForm();
    // Génération des travaux dans la modale
    let allWorks = await getWorks();
    generateWorksModal(allWorks);

    resetForm();
};
// Fermeture de la modale
const closeModal = async function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    const hideModal = function () {
        modal.style.display = 'none'
        modal.removeEventListener('animationend', hideModal)
        modal = null
    };
    modal.addEventListener('animationend', hideModal);
    let allWorks = await getWorks();
    generateWorks(allWorks);
};

const stopPropagation = function (e) {
    e.stopPropagation();
};
// Suppression des travaux
const deleteWorks = (id) => {
    if (!id || id < 0) 
        return
    
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userLogInToken.token}`
        },
    })      
    .then((data) => {
        return data
    })
    .catch((error) => {
        console.log( error )
    })
};
// Affichage des catégories dans la modale d'ajout
const categoriesModalForm = async () => {
    let selectCategoriesModal = document.getElementById('select-categories');

    let allCategories = await getCategories();

    if (!allCategories)
        return 

    for (let i = 0; i < allCategories.length; i++) {
        const categories = allCategories[i];

        let optionElement = document.createElement("option");
        optionElement.value = categories.id;
        // optionElement.dataset.id = categories.id;
        optionElement.innerText = categories.name;
        
        selectCategoriesModal.appendChild(optionElement);
    };
};
// Génération des travaux dans la modale
const generateWorksModal = (allWorks) => {

    if (!allWorks)
        return

    // Sélectionner la div gallerie qui accueillera les travaux
    const portfolioWorks = document.querySelector("#modal-gallery");
    portfolioWorks.innerHTML = "";

    for (let i = 0; i < allWorks.length; i++) {
        const works = allWorks[i];

        // Créer l'élément figure pour les travaux
        let workElement = document.createElement("div");
            workElement.dataset.id = works.id;
            workElement.classList.add("miniature-works");

        // Créeer l'image
        const imageElement = document.createElement("img");
            imageElement.src = works.imageUrl;

        // Créer l'icone poubelle
        const trashcanElement = document.createElement("img");
            trashcanElement.src = "/FrontEnd/assets/icons/trash-can-solid.svg";
            trashcanElement.classList.add("trashcan");
            trashcanElement.dataset.id = works.id;

        // Créer la légende
        const titleElement = document.createElement("p");
            titleElement.innerText = "éditer"; 
            
        // Rattachement des balises
        portfolioWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(trashcanElement);
        workElement.appendChild(titleElement);
    }

    let trashes = document.querySelectorAll(".trashcan");

    trashes.forEach( function(item) {
        item.addEventListener('click', async () => {
            deleteWorks(item.dataset.id);
            let allWorkss = await getWorks();
            generateWorksModal(allWorkss);
        })
    });
};

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    };
    if (index >= focusables.length) {
        index = 0;
    };
    if (index < 0) {
        index = focusables.length - 1;
    };
    focusables[index].focus();
};

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
});

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    };
});



// Correction de navigation à l'intérieur de la modale
const galleryModal = document.getElementById('modal-wrapper-gallery');
const addWorkModal = document.getElementById('modal-wrapper-add-work');

const returnModalBtn = document.getElementById('return-btn');
returnModalBtn.addEventListener('click', function() {
    addWorkModal.style.display = 'none';
    galleryModal.style.display = null;
    resetForm();
});

const closeModalBtn = document.getElementById('close-btn');
closeModalBtn.addEventListener('click', closeModal);

const addWorkBtn = document.getElementById('add-work-btn');
addWorkBtn.addEventListener('click', function() {
    galleryModal.style.display = 'none';
    addWorkModal.style.display = null;
});



// Ajout de travaux 
let addWorkForm = document.querySelector('#add-work-form');
let newWorkImage = document.querySelector('#work-image');
let newWorkTitle = document.querySelector('#work-title');
let newWorkCategory = document.querySelector('#select-categories');

addWorkForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let dataForm = new FormData();

    dataForm.append('image', newWorkImage.files[0]);
    dataForm.append('title', newWorkTitle.value);
    dataForm.append('category', newWorkCategory.value);

    console.log(Array.from(dataForm));

    if (newWorkImage.files[0] && newWorkTitle.value && newWorkCategory.value){

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
				'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${userLogInToken.token}`
            },
            body: dataForm,
        })
        .then((data) => { return data })
        .catch((error) => { console.log( error ) });

        alert("Vous avez ajouté une photo");
        
        document.querySelector(".gallery").innerHTML = "";
        generateWorks();

        document.querySelector("#modal-gallery").innerHTML = "";
        generateWorksModal();
    }else{
        alert("Vérifiez votre saisie");
        return;
    }
});


// Prévisualisation de l'image à télécharger
let outputImagePreview = document.getElementById('output-image');
const photoPreview = function(e) {
    outputImagePreview.src = URL.createObjectURL(e.target.files[0]);
    outputImagePreview.onload = function() {
        URL.revokeObjectURL(outputImagePreview.src);
    };
};
newWorkImage.addEventListener('change', function(e){
    photoPreview(e);
    outputImagePreview.style.display = null;
});
// Réinitialisation du formulaire --> appel dans openModal()
const resetForm = function() {
    addWorkForm.reset();
    outputImagePreview.style.display = 'none';
};



// Appel à la fonction générale
initialize();
