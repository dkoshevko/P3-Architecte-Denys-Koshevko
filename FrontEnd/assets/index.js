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

// Déclaration de fonction qui permet de générer les travaux 
function generateWorks(allWorks) {
    for (let i = 0; i < allWorks.length; i++) {
        const works = allWorks[i];

        // Sélectionner la div gallerie qui accueillera les travaux
        const portfolioWorks = document.querySelector(".gallery");

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