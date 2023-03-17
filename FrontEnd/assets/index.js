// Déclaration des chemins vers l'API
const PATH_API = 'http://localhost:5678/api/';
const PATH_WORKS = 'works/';
const PATH_CATEGORIES = 'categories/';

// Récupération des données de l'API
const fetchData = async (path) => {
    try {
        const response = await fetch(`${PATH_API}${path}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        return await response.json();
    } catch (error) {
        console.log( error );
    }
};
// Récupération des travaux
const getWorks = () => fetchData(PATH_WORKS);

// Récupération des catégories
const getCategories = () => fetchData(PATH_CATEGORIES);

// Suppression des travaux
const deleteWorks = async (id) => {
    if (!id || id < 0) return;
    
    try {
        const response = await fetch(PATH_API + PATH_WORKS + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userLogInToken.token}`
            },
        });
        if (!response.ok) {
           throw new Error('La suppression des données a échoué');
        }
    } catch (error) {
        console.log( error );
    }
};

// Fonction générale
const initialize = async () => {

    // Vérification token user
    checkLogin();

    // Affichage des boutons catégories
    initButtons();
    
    // Affichage des travaux 
    refreshWorks();
};

// Rafraîchissement des travaux 
const refreshWorks = async () => {
    let allWorks = await getWorks();
    generateWorks(allWorks);
    generateWorksInModal(allWorks);
    // Réinitialisation du formulaire
    resetForm();
}

// Vérification si l'utilisateur est autentifié en tant qu'administrateur
let userLogInToken = window.sessionStorage.getItem('loggedUser');
const checkLogin = () => {

    if (userLogInToken !== null ) {
        userLogInToken = JSON.parse(userLogInToken);
        
        const logInLogOut = document.getElementById("login-logout");
        logInLogOut.innerText = "logout";

        // Affichage des éléments de l'interface d'édition
        editionModeWhenLogged();

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

    // Cacher les boutons des filtres si admin connecté (comme sur la maquette)
    if (userLogInToken !== null) {
        filtersSection.innerHTML = "";
    }
};



// Création du bandeau noir "mode édition"
const editModeBlackBand = () => {
    const header = document.querySelector('header');

    const headband = document.createElement('div');
    headband.classList.add('headband');

    const editionMode = document.createElement('div');
    editionMode.classList.add('edition-mode');

    const editModeText = document.createElement('p')
    editModeText.innerText = 'Mode édition';

    const editModeTextIcon = document.createElement('i');
    editModeTextIcon.classList.add('fa-regular');
    editModeTextIcon.classList.add('fa-pen-to-square');
    editModeTextIcon.style.color = '#FFFFFF';

    const publishButton = document.createElement('div');
    publishButton.classList.add('publish-button');
    publishButton.innerText = 'publier les changements';

    header.before(headband);
    headband.appendChild(editionMode);
    editionMode.appendChild(editModeTextIcon);
    editionMode.appendChild(editModeText);
    headband.appendChild(publishButton);
};
// Création du bouton "modifier" en dessous de la photo de l'architecte
const editModeMainPhoto = () => {
    const mainPhoto = document.querySelector('#introduction figure img');

    const mainPhotoEdit = document.createElement('div');
    mainPhotoEdit.style.display = 'flex';
    mainPhotoEdit.style.width = '80%';
    mainPhotoEdit.style.margin = 'auto';
    mainPhotoEdit.style.marginTop = '1rem';
    mainPhotoEdit.style.cursor = 'pointer';

    const mainPhotoEditIcon = document.createElement('i');
    mainPhotoEditIcon.classList.add('fa-regular');
    mainPhotoEditIcon.classList.add('fa-pen-to-square');
    mainPhotoEditIcon.style.fontSize = '1em';
    mainPhotoEditIcon.style.color = '#000000';

    const mainPhotoEditText = document.createElement('p');
    mainPhotoEditText.style.fontSize = '1em';
    mainPhotoEditText.style.color = '#000000';
    mainPhotoEditText.style.marginLeft = '0.3rem';
    mainPhotoEditText.innerText = 'modifier';

    mainPhoto.after(mainPhotoEdit);
    mainPhotoEdit.appendChild(mainPhotoEditIcon);
    mainPhotoEdit.appendChild(mainPhotoEditText);
};
// Création du bouton "modifier" pour les travaux (BOUTON PRINCIPAL)
const editWorks = () => {
    const myProjects = document.querySelector('.change-title');

    const editButton = document.createElement('div');
    editButton.classList.add('js-modal');
    editButton.setAttribute('id','change-works-btn');

    const editButtonIcon = document.createElement('i');
    editButtonIcon.classList.add('fa-regular');
    editButtonIcon.classList.add('fa-pen-to-square')

    const editButtonText = document.createElement('a');
    editButtonText.href = '#modal1';
    editButtonText.style.marginLeft = '0.3rem';
    editButtonText.innerText = 'modifier';
    
    myProjects.appendChild(editButton);
    editButton.appendChild(editButtonIcon);
    editButton.appendChild(editButtonText);

    editButton.addEventListener('click', openModal);
};
// Affichacge du "mode édition"
const editionModeWhenLogged = () => {
    editModeBlackBand();
    editModeMainPhoto();
    editWorks();
};



// Création de la fenêtre modale
let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];

// Ouverture de la modale
const openModal = async (e) => {
    e.preventDefault();
    
    const target = e.target.getAttribute('href');
    modal = document.querySelector(target);
    modal.style.display = "";
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');

    // À chaque ouverture de la modale affichage des travaux (et non pas de la dernière div affichée)
    showFirstModalPage();

    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    
    // Correction de navigation à l'intérieur de la modale
    const galleryModal = document.getElementById('modal-wrapper-gallery');
    const addWorkModal = document.getElementById('modal-wrapper-add-work');

    // Fermeture au click sur la croix sur la modale d'ajout de travaux
    document.getElementById('close-btn').addEventListener('click', closeModal);

    // Retour sur la modale de suppression au click sur la flèche
    document.getElementById('return-btn').addEventListener('click', function() {
        addWorkModal.style.display = 'none';
        galleryModal.style.display = null;

        // Réinitialisation du formulaire
        resetForm();
    });

    // Redirection sur la modale d'ajout au click sur le bouton "Ajouter une photo"
    document.getElementById('add-work-btn').addEventListener('click', function() {
        galleryModal.style.display = 'none';
        addWorkModal.style.display = null;
    });

    // Stop propagation sur la modale d'ajout de travaux
    document.getElementById('modal-wrapper-add-work').addEventListener('click', stopPropagation);

    // Affichage dynamique des catégories de travaux sur la modale d'ajout
    categoriesModalForm();

    // Regénération des travaux
    refreshWorks();
};

// Fermeture de la modale
const closeModal = async (e) => {
    if (modal === null) return;
    e.preventDefault();

    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    const hideModal = () => {
        modal.style.display = 'none'
        modal.removeEventListener('animationend', hideModal)
        modal = null
    };
    modal.addEventListener('animationend', hideModal);
    refreshWorks();
};

const stopPropagation = (e) => {
    e.stopPropagation();
};

// Afficher la première div de la modale "gallerie"
const showFirstModalPage = () => {
    document.getElementById('modal-wrapper-gallery').style.display = "";
    document.getElementById('modal-wrapper-add-work').style.display = "none";
};

// Affichage des catégories dans la modale d'ajout
const categoriesModalForm = async () => {
    const selectCategoriesModal = document.getElementById('select-categories');
    selectCategoriesModal.innerHTML = "";
    
    const allCategories = await getCategories();

    if (!allCategories)
        return 

    allCategories.forEach((category) => {
        const optionElement = document.createElement('option');
        optionElement.value = category.id;
        optionElement.innerText = category.name;
    
        selectCategoriesModal.appendChild(optionElement);
    });
};

// Génération des éléments pour les travaux
const generateWorkElementsInModal = (works) => {
    // Créer l'élément figure pour les travaux
    const workElement = document.createElement('div');
    workElement.dataset.id = works.id;
    workElement.classList.add('miniature-works');

    // Créeer l'image
    const imageElement = document.createElement('img');
    imageElement.src = works.imageUrl;

    // Créer l'icone poubelle
    const trashcanElement = document.createElement('img');
    trashcanElement.src = '/FrontEnd/assets/icons/trash-can-solid.svg';
    trashcanElement.classList.add('trashcan');
    trashcanElement.dataset.id = works.id;

    // Créer la légende
    const titleElement = document.createElement('p');
    titleElement.innerText = 'éditer';

    // Rattachement des balises
    workElement.appendChild(imageElement);
    workElement.appendChild(trashcanElement);
    workElement.appendChild(titleElement);

    return workElement;
};

// Suppression des travaux au clic sur la poubelle
const deleteWorksClick = async (event) => {
    event.preventDefault();
    const idToDelete = event.target.dataset.id;
    await deleteWorks(idToDelete);
    refreshWorks();
};

// Génération des travaux dans la modale
const generateWorksInModal = (allWorks) => {
    if (!allWorks) 
        return;

    // Sélectionner la div gallerie qui accueillera les travaux
    const portfolioWorks = document.querySelector('#modal-gallery');
    portfolioWorks.innerHTML = '';

    allWorks.forEach((works) => {
        const workElement = generateWorkElementsInModal(works);

        workElement.querySelector('.trashcan').addEventListener('click', deleteWorksClick);

        portfolioWorks.appendChild(workElement);
    });
};

// Focus sur les éléments focusables (utilisation de la touche Tab)
const focusInModal = (e) => {
    e.preventDefault();

    let index = focusables.findIndex((f) => f === modal.querySelector(':focus'));
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

// Écoute des touches Esc et Tab
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    };
});



// Ajout de travaux 
let addWorkForm = document.querySelector('#add-work-form');
let newWorkImage = document.querySelector('#work-image');
let newWorkTitle = document.querySelector('#work-title');
let newWorkCategory = document.querySelector('#select-categories');

// Fonction permettant d'ajouter des travaux à l'API
const postWorks = async (e) => {
    e.preventDefault();

    let dataForm = new FormData();

    dataForm.append('image', newWorkImage.files[0]);
    dataForm.append('title', newWorkTitle.value);
    dataForm.append('category', newWorkCategory.value);

    console.log(Array.from(dataForm));

    if (newWorkImage.files[0] && newWorkTitle.value && newWorkCategory.value){
        try {
            const response = await fetch(PATH_API + PATH_WORKS, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${userLogInToken.token}`
                },
                body: dataForm,
            });
            alert("Vous avez ajouté une photo");
            refreshWorks();
            showFirstModalPage();
        } catch(error) {
            console.log(error);
        }
    } else{
        alert("Vérifiez votre saisie");
        return;
    };
};

// Envoi d'un nouvel travail à l'API lors de la soumission du formulaire
addWorkForm.addEventListener('submit', postWorks); 



// Prévisualisation de l'image à télécharger
let outputImagePreview = document.getElementById('output-image');
const photoPreview = function(e) {
    outputImagePreview.src = URL.createObjectURL(e.target.files[0]);
    outputImagePreview.onload = function() {
        URL.revokeObjectURL(outputImagePreview.src);
    };
};
newWorkImage.addEventListener('change', (e) => {
    photoPreview(e);
    outputImagePreview.style.display = null;
});

// Réinitialisation du formulaire d'ajout de travaux
const resetForm = function() {
    addWorkForm.reset();
    outputImagePreview.style.display = 'none';
    newWorkCategory.value = "";
};



// Appel à la fonction générale
initialize();
