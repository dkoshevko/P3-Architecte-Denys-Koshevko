// Déclaration de fonction qui permet de générer les travaux 
let allWorks;
function generateWorks(allWorks) {
    for (let i = 0; i < allWorks.length; i++) {

        const works = allWorks[i];
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
}

// Récuperation des travaux depuis l'API
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(allWorks => {
    generateWorks(allWorks);
  });

