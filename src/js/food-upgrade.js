    // src/js/food-upgrades.js
    import { spendMoney } from './money.js';

    // Structure des upgrades
    const foodUpgrades = [
    {
        id: 'FirstFood',
        name: 'Carottes',
        basePrice: 10,
        baseIncome: 0.2,
        level: 0,
        buttonId: 'FirstFoodButton'
    },
    {
        id: 'SecondFood',
        name: 'Foin',
        basePrice: 25,
        baseIncome: 0.5,
        level: 0,
        buttonId: 'SecondFoodButton'
    },
    {
        id: 'ThirdFood',
        name: 'Granulés',
        basePrice: 50,
        baseIncome: 1,
        level: 0,
        buttonId: 'ThirdFoodButton'
    },
    {
        id: 'FourthFood',
        name: 'Pomme',
        basePrice: 100,
        baseIncome: 2,
        level: 0,
        buttonId: 'FourthFoodButton'
    },
    {
        id: 'FifthFood',
        name: 'Golden Pomme',
        basePrice: 1000,
        baseIncome: 25,
        level: 0,
        buttonId: 'FifthFoodButton'
    }
    ];

    // Revenu total immédiat (au lieu de passif par seconde)
    let totalIncome = 0;

    // Fonction pour initialiser les upgrades
    function initFoodUpgrades() {
    // Ajouter des écouteurs d'événements à tous les boutons d'upgrade
    foodUpgrades.forEach(upgrade => {
        const button = document.getElementById(upgrade.buttonId);
        if (button) {
        button.addEventListener('click', () => purchaseUpgrade(upgrade.id));
        }
    });
    
    // Pas besoin de système de revenu passif puisque le gain est immédiat
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
        
        // Calculer et ajouter immédiatement le revenu
        //addImmediateIncome(upgrade);
        
        // Mettre à jour l'affichage
        updateUpgradeDisplay(upgrade);
    } else {
        // Feedback visuel pour indiquer que le joueur n'a pas assez d'argent
        const upgradeElement = document.getElementById(upgrade.id);
        if (upgradeElement) {
        upgradeElement.classList.add('insufficient-funds');
        setTimeout(() => {
            upgradeElement.classList.remove('insufficient-funds');
        }, 300);
        }
    }
    }

    // Fonction pour ajouter immédiatement le revenu à l'achat
    function addImmediateIncome(upgrade) {
    // Calculer le revenu à ajouter
    const incomeToAdd = upgrade.baseIncome * 10; // Valeur ajustable selon votre préférence
    
    // Importer dynamiquement addMoney pour éviter les dépendances circulaires
    import('./money.js').then(module => {
        const addMoney = module.addMoney;
        // Ajouter directement l'argent au compte du joueur
        addMoney(incomeToAdd);
        
        // Afficher un message de débogage
        console.log(`Ajout immédiat de ${incomeToAdd}$ pour l'achat de ${upgrade.name}`);
        
        // Créer un texte flottant pour visualiser le gain
        createIncomeFloatingText(upgrade.name, incomeToAdd);
    });
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
    }

    // Ajouter le style pour l'animation de gain
    const addGainAnimationStyle = () => {
    if (!document.getElementById('gain-animation-style')) {
        const style = document.createElement('style');
        style.id = 'gain-animation-style';
        style.textContent = `
        @keyframes float-gain {
            0% { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(1.5) translateY(-30px); }
        }
        
        .insufficient-funds {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        `;
        document.head.appendChild(style);
    }
    };

    // Initialiser les upgrades et les styles au chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
    initFoodUpgrades();
    addGainAnimationStyle();
    });

    // Exporter les fonctions si nécessaire
    export { foodUpgrades };