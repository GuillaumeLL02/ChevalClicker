import { spendMoney } from './money.js';
import { addStamina } from './stamina-bar.js'; 

// Structure des upgrades 
const foodUpgrades =  [
    {
        id: 'FirstFood',
        name: 'Carottes',
        basePrice: 10,
        level: 0,
        buttonId: 'FirstFoodButton',
        staminaBonus: 4  // Points de stamina gagnés par achat
    },
    {
        id: 'SecondFood',
        name: 'Foin',
        basePrice: 25,
        level: 0,
        buttonId: 'SecondFoodButton',
        staminaBonus: 8  
    },
    {
        id: 'ThirdFood',
        name: 'Granulés',
        basePrice: 50,
        level: 0,
        buttonId: 'ThirdFoodButton',
        staminaBonus: 22 
    },
    {
        id: 'FourthFood',
        name: 'Pomme',
        basePrice: 100,
        level: 0,
        buttonId: 'FourthFoodButton',
        staminaBonus: 42  
    },
    {
        id: 'FifthFood',
        name: 'Golden Pomme',
        basePrice: 300,
        level: 0,
        buttonId: 'FifthFoodButton',
        staminaBonus: 50  
    }
];

// Fonction pour initialiser les upgrades
function initFoodUpgrades() {
    foodUpgrades.forEach(upgrade => {
        const button = document.getElementById(upgrade.buttonId);
        if (button) {
            button.addEventListener('click', () => purchaseUpgrade(upgrade.id));
        }
    });

    // Mise à jour initiale de l'affichage
    foodUpgrades.forEach(upgrade => {
        updateUpgradeDisplay(upgrade);
    });
}

// Fonction pour acheter un upgrade
function purchaseUpgrade(upgradeId) {
    const upgrade = foodUpgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    // Calculer le prix actuel basé sur le niveau
    const currentPrice = upgrade.basePrice * Math.pow(2, upgrade.level);

    // Tenter d'acheter l'upgrade
    if (spendMoney(currentPrice)) {
        // Mise à jour du niveau
        upgrade.level++;
        
        // Ajout de stamina de la nourriture
        const staminaGain = upgrade.staminaBonus + ( upgrade.level * 2 ); 
        addStamina(staminaGain);

        // Mettre à jour l'affichage
        updateUpgradeDisplay(upgrade);
    }

}

// Fonction pour mettre à jour l'affichage d'un upgrade
function updateUpgradeDisplay(upgrade) {
    const upgradeElement = document.getElementById(upgrade.id);
    if (!upgradeElement) return;

    // Mettre à jour le niveau affiché
    const levelElement = upgradeElement.querySelector('.Number');
    if (levelElement) {
        levelElement.textContent = `Lv: ${upgrade.level}`;
    }

    // Mettre à jour le prix affiché
    const priceElement = upgradeElement.querySelector('.Price');
    if (priceElement) {
        const nextPrice = upgrade.basePrice * Math.pow(2, upgrade.level);
        priceElement.textContent = `${Math.floor(nextPrice)}$`;
    }
    
    // Ajouter info sur le gain de stamina
    const nameElement = upgradeElement.querySelector('.Name');
    if (nameElement) {
        const staminaGain = upgrade.staminaBonus + (upgrade.level * 2);
        nameElement.textContent = `${upgrade.name} (+${Math.round(staminaGain)})`;
    }
}


// Initialiser les upgrades et les styles au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initFoodUpgrades();
});


export { foodUpgrades };