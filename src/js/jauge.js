// src/js/click-meter.js

let clickMeterValue = 0;
let clickMultiplier = 1;
const MAX_METER = 100;
const DECAY_RATE = 1.5; // Points perdus par seconde
const CLICK_VALUE = 5; // Valeur gagnée par clic

// Fonction pour initialiser les éléments DOM une fois le document chargé
function initClickMeter() {
  // Récupérer les éléments DOM
  const clickMeterFill = document.querySelector('.click-meter-fill');
  const clickMeterGlow = document.querySelector('.click-meter-glow');
  const clickMeterMultiplier = document.querySelector('.click-meter-multiplier');

  if (!clickMeterFill || !clickMeterGlow || !clickMeterMultiplier) {
    console.error("Éléments de la jauge d'énergie introuvables");
    return;
  }

  // Initialiser l'affichage
  updateClickMeter();
  
  // Initialiser un intervalle pour faire diminuer progressivement le compteur
  setInterval(decayClickMeter, 100);
}

// Fonction pour mettre à jour l'affichage du compteur
function updateClickMeter() {
  const clickMeterFill = document.querySelector('.click-meter-fill');
  const clickMeterGlow = document.querySelector('.click-meter-glow');
  const clickMeterMultiplier = document.querySelector('.click-meter-multiplier');
  
  if (!clickMeterFill || !clickMeterGlow || !clickMeterMultiplier) {
    console.error("Éléments de la jauge d'énergie introuvables");
    return clickMultiplier;
  }
  
  // Limiter la valeur du compteur entre 0 et MAX_METER
  clickMeterValue = Math.max(0, Math.min(MAX_METER, clickMeterValue));
  
  // Mettre à jour la hauteur de la barre
  const heightPercentage = clickMeterValue + '%';
  clickMeterFill.style.height = heightPercentage;
  clickMeterGlow.style.height = heightPercentage;
  
  // Déterminer le multiplicateur en fonction de la valeur du compteur
  if (clickMeterValue >= 80) {
    clickMultiplier = 5;
    clickMeterMultiplier.textContent = 'x5';
    clickMeterMultiplier.style.color = '#ff0000';
  } else if (clickMeterValue >= 60) {
    clickMultiplier = 3;
    clickMeterMultiplier.textContent = 'x3';
    clickMeterMultiplier.style.color = '#ff4500';
  } else if (clickMeterValue >= 40) {
    clickMultiplier = 2;
    clickMeterMultiplier.textContent = 'x2';
    clickMeterMultiplier.style.color = '#ffa500';
  } else {
    clickMultiplier = 1;
    clickMeterMultiplier.textContent = 'x1';
    clickMeterMultiplier.style.color = '#ff6b00';
  }
  
  // Ajouter ou retirer les classes d'animation selon l'état
  if (clickMultiplier > 1) {
    clickMeterMultiplier.classList.add('multiplier-active');
    clickMeterGlow.classList.add('glow-active');
  } else {
    clickMeterMultiplier.classList.remove('multiplier-active');
    clickMeterGlow.classList.remove('glow-active');
  }
  
  // Retourner le multiplicateur actuel pour l'utiliser dans vos calculs d'argent
  return clickMultiplier;
}

// Fonction pour incrémenter le compteur (à appeler lors d'un clic)
function incrementClickMeter() {
  clickMeterValue += CLICK_VALUE;
  return updateClickMeter();
}

// Fonction pour faire diminuer progressivement le compteur
function decayClickMeter() {
  if (clickMeterValue > 0) {
    clickMeterValue -= DECAY_RATE / 10; // Divisé par 10 car généralement appelé toutes les 100ms
    updateClickMeter();
  }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initClickMeter);

// Exporter les fonctions nécessaires
export { incrementClickMeter, clickMultiplier };