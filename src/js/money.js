import { loadGame,saveGame } from './save-manager.js';

let money = (loadGame()?.money) || 0;
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

function updateMoneyDisplay() {
  moneyDisplay.textContent = money;
  saveGame(); // Sauvegarde à chaque changement
}

// Fonction pour ajouter de l'argent avec une animation
function addMoney(amount) {
  money += amount;
  updateMoneyDisplay();
 
}

// Fonction pour dépenser de l'argent
function spendMoney(amount) {
  if (money >= amount) {
    money -= amount;
    updateMoneyDisplay();
    return true;
  }

  moneyDisplay.classList.add('not-enough-money'); 

   // Retirer la classe après 1 seconde
   setTimeout(() => {
    moneyDisplay.classList.remove('not-enough-money');
  }, 1000);
  
  return false;
}

// Initialiser l'affichage au chargement
document.addEventListener('DOMContentLoaded', initMoney);

// Exposer les fonctions pour qu'elles soient utilisables par d'autres scripts
export { money, addMoney, spendMoney };