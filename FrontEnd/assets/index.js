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




// Vérification si l'utilisateur est autentifié en tant qu'administrateur
let userLogInToken = window.sessionStorage.getItem("loggedUser");

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




// Déclaration de fonction qui permet de générer les travaux 
function generateWorks(allWorks) {
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

        // Créer le légende
        const titleElement = document.createElement("figcaption");
            titleElement.innerText = works.title;

        // Rattachement des balises
        portfolioWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
    }
};

// Affichage des travaux 
getWorks().then(allWorks => generateWorks(allWorks));




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

buttonAllWorks.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML = "";
    getWorks().then(allWorks => generateWorks(allWorks));
});

// Déclaration de la fonction pour générer les boutons des catégories
function generateButtons(allButtons) {
    for (let i = 0; i < allButtons.length; i++) {
        const buttons = allButtons[i];

        let buttonElement = document.createElement("button");
        buttonElement.dataset.id = buttons.id;
        buttonElement.innerText = buttons.name;
        buttonElement.classList.add('filters');
        
        filtersSection.appendChild(buttonElement);

        buttonElement.addEventListener("click", function() {
            document.querySelector(".gallery").innerHTML = "";
            getWorks().then(allWorks => {
                const worksForCategory = allWorks.filter(work => work.category.id == buttonElement.dataset.id);
                generateWorks(worksForCategory);
            });
        });
    };
};

// Affichage des catégories et travaux filtrés
getCategories().then(allButtons => generateButtons(allButtons));

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




// Création de la fenêtre modale
let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];

const openModal = function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    if (target.startsWith('#')) {
        modal = document.querySelector(target)
    };
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    getWorks().then(allWorks => generateWorksModal(allWorks));
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    // window.setTimeout(function () {
    //     modal.style.display = "none";
    //     modal = null;
    // }, 500);
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

    getWorks().then(allWorks => generateWorks(allWorks));
};

const stopPropagation = function (e) {
    e.stopPropagation();
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



function deleteWorks(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${userLogInToken.token}`,
            'Content-Type': 'application/json'
        },
    })		
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log( error )
    });
    return false;
};

function generateWorksModal(allWorks) {
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
            // trashcanElement.addEventListener('click', deleteWorks(works.id));

            // Créer le légende
            const titleElement = document.createElement("p");
            titleElement.innerText = "éditer";
            
            // Rattachement des balises
            portfolioWorks.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(trashcanElement);
            workElement.appendChild(titleElement);
    }

    let trashes = document.querySelectorAll(".trashcan");

    trashes.forEach(function(item) {
    item.addEventListener('click', () => {
        deleteWorks(item.dataset.id)
    })
    });
};





