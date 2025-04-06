// Ajouter ce code à votre fichier JavaScript

// Variables pour les PV du cheval
let maxHorseHealth = 100;
let currentHorseHealth = 100;

// Fonction pour mettre à jour l'affichage des PV
function updateHorseHealth(newHealth) {
    // Limiter les PV entre 0 et max
    newHealth = Math.max(0, Math.min(maxHorseHealth, newHealth));
    
    // Récupérer les éléments de l'interface
    const healthFill = document.querySelector('.health-fill');
    const healthValue = document.querySelector('.health-value');
    
    // Calculer le pourcentage de PV
    const healthPercentage = (newHealth / maxHorseHealth) * 100;
    
    // Appliquer une animation si les PV diminuent
    if (newHealth < currentHorseHealth) {
        healthFill.classList.add('damage');
        setTimeout(() => {
            healthFill.classList.remove('damage');
        }, 500);
    }
    
    // Mettre à jour l'affichage
    healthFill.style.width = healthPercentage + '%';
    healthValue.textContent = `${newHealth}/${maxHorseHealth}`;
    
    // Changer la couleur selon le niveau de santé
    if (healthPercentage <= 25) {
        healthFill.style.background = '#ff4d4d'; // Rouge
    } else if (healthPercentage <= 50) {
        healthFill.style.background = '#ffad33'; // Orange
    } else {
        healthFill.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)'; // Vert
    }
    
    // Enregistrer la nouvelle valeur
    currentHorseHealth = newHealth;
}

// Exemple d'utilisation :
// updateHorseHealth(75); // Réduit les PV à 75