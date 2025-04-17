// src/js/script_gameplay.js
import { addMoney } from './money.js';
import { incrementClickMeter } from './jauge.js';

// Attend que le DOM soit chargé avant d'initialiser
document.addEventListener('DOMContentLoaded', initGameplay);

function initGameplay() {
  // Récupérer l'élément sur lequel le joueur clique (le modèle 3D du cheval)
  const clickableElement = document.getElementById('Model3D');
  
  if (!clickableElement) {
    console.error("Élément cliquable introuvable");
    return;
  }

  // Valeur de base pour chaque clic
  const BASE_CLICK_VALUE = 1;

  // Ajouter l'écouteur d'événement au clic
  clickableElement.addEventListener('click', handlePlayerClick);

  // Fonction qui gère le clic du joueur
  function handlePlayerClick(event) {
    // Incrémenter la jauge et obtenir le multiplicateur actuel
    const currentMultiplier = incrementClickMeter();
    
    // Calculer la valeur d'argent à ajouter en fonction du multiplicateur
    const moneyToAdd = BASE_CLICK_VALUE * currentMultiplier;
    
    // Ajouter l'argent au compteur du joueur
    addMoney(moneyToAdd);
    
    // Créer un effet visuel de texte flottant
    createFloatingText(event.clientX, event.clientY, '+' + moneyToAdd);
  }

  // Fonction pour créer un texte flottant qui disparaît
  function createFloatingText(x, y, text) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';
    
    document.body.appendChild(floatingText);
    
    // Animer puis supprimer
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, 1000);
  }

  // Ajouter CSS pour le texte flottant s'il n'existe pas déjà
  if (!document.getElementById('floating-text-style')) {
    const style = document.createElement('style');
    style.id = 'floating-text-style';
    style.textContent = `
      .floating-text {
        position: absolute;
        font-family: 'Georgia', serif;
        font-size: 18px;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 2px 2px 2px #000;
        pointer-events: none;
        z-index: 1000;
        animation: float-up 1s ease-out forwards;
      }
      
      @keyframes float-up {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Ne pas exporter de fonctions car ce script agit comme point d'entrée