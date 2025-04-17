// src/js/money.js

// Variables pour le système d'argent
let money = 0;
let moneyDisplay;

// Fonction pour initialiser le système d'argent
function initMoney() {
  moneyDisplay = document.getElementById('money-value');
  
  if (!moneyDisplay) {
    console.error("Élément d'affichage d'argent introuvable");
    return;
  }
  
  updateMoneyDisplay();
}

// Fonction pour mettre à jour l'affichage de l'argent
function updateMoneyDisplay() {
  if (!moneyDisplay) {
    moneyDisplay = document.getElementById('money-value');
  }
  
  if (moneyDisplay) {
    moneyDisplay.textContent = money;
  }
}

// Fonction pour ajouter de l'argent avec une animation
function addMoney(amount) {
  money += amount;
  updateMoneyDisplay();
  
  // Ajouter une animation de pulse
  const moneyContainer = document.querySelector('.money-container');
  if (moneyContainer) {
    moneyContainer.classList.add('money-pulse');
    
    // Retirer la classe d'animation après la fin
    setTimeout(() => {
      moneyContainer.classList.remove('money-pulse');
    }, 300);
  }
}

// Fonction pour dépenser de l'argent
function spendMoney(amount) {
  if (money >= amount) {
    money -= amount;
    updateMoneyDisplay();
    return true;
  }
  return false;
}

// Initialiser l'affichage au chargement
document.addEventListener('DOMContentLoaded', initMoney);

// Exposer les fonctions pour qu'elles soient utilisables par d'autres scripts
export { money, addMoney, spendMoney };