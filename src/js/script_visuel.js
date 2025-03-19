document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const leftSection = document.querySelector(".left-section");
    const rightSection = document.querySelector(".right-section");

    let isLeftActive = true;

    toggleBtn.addEventListener("click", () => {
        if (isLeftActive) {
            leftSection.style.transform = "translateX(-100%)";
            rightSection.style.transform = "translateX(-100%)";
        } else {
            leftSection.style.transform = "translateX(0)";
            rightSection.style.transform = "translateX(0)";
        }
        isLeftActive = !isLeftActive;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const leftSection = document.querySelector(".left-section");
    const rightSection = document.querySelector(".right-section");

    let isLeftActive = true;

    toggleBtn.addEventListener("click", () => {
        if (isLeftActive) {
            leftSection.style.transform = "translateX(-100%)";
            rightSection.style.transform = "translateX(-100%)";
        } else {
            leftSection.style.transform = "translateX(0)";
            rightSection.style.transform = "translateX(0)";
        }
        isLeftActive = !isLeftActive;
    });
});

// Animation sur le click du bouton
let rotationDroit = true;  // Variable pour alterner les rotations

document.getElementById("buttonCheval").addEventListener("click", function() {

    if (rotationDroit) {
        this.classList.add("tourner-droit");
        this.classList.remove("tourner-gauche");
    } else {
        this.classList.add("tourner-gauche");
        this.classList.remove("tourner-droit");
    }
    setTimeout(() => {
        this.classList.remove("tourner-droit");
        this.classList.remove("tourner-gauche");

    }, 200); // 400ms correspond à la durée de l'animation

    // Alterner la direction pour le prochain clic
    rotationDroit = !rotationDroit;
});


