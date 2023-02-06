// Déclaration de fonction qui permet de générer les travaux 
function generateWorks(getWorks) {
    for (let i = 0; i < getWorks.length; i++) {

        const works = getWorks[i];
        // Sélectionner la div gallerie qui accueillera les travaux
        const portfolioWorks = document.querySelector(".gallery");

        // Créer l'élément figure pour les travaux
        const workElement = document.createElement("figure");
        workElement.dataset.id = works.id;

        // Créeer l'image
        const imageElement = document.createElement("img");
        imageElement.src = works.imageUrl;
        imageElement.crossOrigin = "anonymous";     // Résolution de l'erreur CORP

        // Créer le légende
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = works.title;

        // Rattachement des balises
        portfolioWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
    }
};

// Récuperation des travaux depuis l'API
const allWorks = fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(allWorks => {
    generateWorks(allWorks);
});

// Filtrage des travaux
const all = fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(all => {
    const buttonObjects = document.getElementById("objects-filter");
    buttonObjects.addEventListener("click", function () {
        const showObjects = all.filter(work => work.category.id === 1);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(showObjects);
    });


    const buttonApartmets = document.getElementById("apartmets-filter");
    buttonApartmets.addEventListener("click", function () {
        const showApartmets = all.filter(work => work.category.id === 2);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(showApartmets);
    });


    const buttonHotels = document.getElementById("hotels-filter");
    buttonHotels.addEventListener("click", function () {
        const showHotels = all.filter(work => work.category.id === 3);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(showHotels);
    });


    const buttonAllWorks = document.getElementById("all-filter");
    buttonAllWorks.addEventListener("click", function () {
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(all);
    });
});

