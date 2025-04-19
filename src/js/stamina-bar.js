let staminaValue =  10;
const MAX_STAMINA = 200;  

// Simplification des multiplicateurs à 3 niveaux clairement distincts
const STAMINA_MULTIPLIER_LEVELS = [
  { threshold: 140, value: 3, color: '#4CAF50' }, // Stamina haute (140-200) = x3
  { threshold: 60, value: 2, color: '#FF9800' }, // Stamina moyenne (60-140) = x2
  { threshold: 0, value: 1, color: '#F44336' }   // Stamina faible (0-60) = x1
];

let staminaDecayInterval = null;

// Fonction pour initialiser les éléments DOM une fois le document chargé
function initStaminaBar() {
  // Récupérer les éléments DOM
  const staminaBarFill = document.querySelector('.stamina-bar-fill');
  const staminaBarGlow = document.querySelector('.stamina-bar-glow');
  const staminaValueDisplay = document.querySelector('.stamina-value');
  const staminaContainer = document.querySelector('.stamina-bar-container');

  if (!staminaBarFill || !staminaBarGlow || !staminaValueDisplay || !staminaContainer) {
    console.error("Éléments de la barre de stamina introuvables");
    return;
  }

  // Initialiser l'affichage
  updateStaminaBar();
  
  // Démarrer la diminution automatique de stamina
  startStaminaDecay();
}

// Fonction pour mettre à jour l'affichage de la barre de stamina avec indication claire du multiplicateur
function updateStaminaBar() {
  const staminaBarFill = document.querySelector('.stamina-bar-fill');
  const staminaBarGlow = document.querySelector('.stamina-bar-glow');
  const staminaValueDisplay = document.querySelector('.stamina-value');
  
  // Limiter la valeur entre 0 et MAX_STAMINA
  staminaValue = Math.max(10, Math.min(MAX_STAMINA, staminaValue));
  
  // Mettre à jour la largeur de la barre
  const widthPercentage = (staminaValue / MAX_STAMINA) * 100 + '%';
  staminaBarFill.style.width = widthPercentage;
  staminaBarGlow.style.width = widthPercentage;
  
  // Trouver le niveau de multiplicateur actuel
  const currentLevel = STAMINA_MULTIPLIER_LEVELS.find(level => staminaValue >= level.threshold);
  
  // Mise à jour visuelle selon le niveau de multiplicateur
  staminaBarFill.style.background = `linear-gradient(to right, ${currentLevel.color}, ${currentLevel.color}dd)`;
  staminaBarGlow.style.background = currentLevel.color;
  
  // Afficher la valeur de stamina et le multiplicateur
  staminaValueDisplay.innerHTML = `<span>x${currentLevel.value}</span>`;
  staminaValueDisplay.style.color = currentLevel.color;
  
  // Ajouter une classe CSS pour indication visuelle du niveau
  staminaValueDisplay.className = 'stamina-value';
  staminaValueDisplay.classList.add(`stamina-level-${currentLevel.value}`);

}


// Fonction pour ajouter de la stamina 
function addStamina(amount) {
  staminaValue += amount;
  if (staminaValue > MAX_STAMINA) staminaValue = MAX_STAMINA;
  updateStaminaBar();
}

// Fonction pour démarrer la diminution automatique de stamina
function startStaminaDecay() {
  // Éviter de créer plusieurs intervalles
  if (staminaDecayInterval) clearInterval(staminaDecayInterval);
  
  staminaDecayInterval = setInterval(() => {
    // Diminuer progressivement la stamina
    if (staminaValue > 0) {
      staminaValue -= 3;
      updateStaminaBar();
    }
    if (staminaValue > 160) {
      staminaValue -= 5;
      updateStaminaBar()
    }
  }, 7000); // Diminution toutes les 5 secondes

  
}

// Fonction pour récupérer le multiplicateur actuel basé sur la stamina
function getCurrentStaminaMultiplier() {
  const currentLevel = STAMINA_MULTIPLIER_LEVELS.find(level => staminaValue >= level.threshold);
  return currentLevel ? currentLevel.value : 1;
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  initStaminaBar();
  
});


// Exporter les fonctions nécessaires
export { 

  addStamina, 
  staminaValue, 
  getCurrentStaminaMultiplier, 
  STAMINA_MULTIPLIER_LEVELS 
};