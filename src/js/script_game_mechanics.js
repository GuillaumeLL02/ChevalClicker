// Classe de gestion du jeu Cheval Clicker
class ChevalClickerGame {
    constructor() {
        // États initiaux du jeu
        this.argent = 0;
        this.cheval = {
            niveau: 0,
            sante: 100,
            energie: 100,
            bonheur: 50
        };

        // Configuration des améliorations
        this.ameliorations = {
            nourriture: [
                {
                    nom: 'Carottes',
                    prix: 10,
                    effet: { sante: 5, energie: 5 },
                    niveau: 1
                },
                {
                    nom: 'Foin',
                    prix: 25,
                    effet: { sante: 10, energie: 10 },
                    niveau: 0
                },
                {
                    nom: 'Granulés',
                    prix: 50,
                    effet: { sante: 15, energie: 15 },
                    niveau: 0
                }
            ],
            patures: [
                {
                    nom: 'Pâture Basic',
                    prix: 100,
                    effet: { bonheur: 10 },
                    niveau: 1
                },
                {
                    nom: 'Pâture Améliorée',
                    prix: 250,
                    effet: { bonheur: 20 },
                    niveau: 0
                }
            ]
        };

        // Initialisation des écouteurs d'événements
        this.initialiserEcouteurs();
        this.mettreAJourAffichage();
    }

    initialiserEcouteurs() {
        const boutonCheval = document.getElementById('buttonCheval');
        const boutonNourriture = document.querySelectorAll('.Foods .UpgradeButton');
        const boutonPatures = document.querySelectorAll('.Upgrade .UpgradeButton');

        // Écouteur pour les clics sur le cheval
        boutonCheval.addEventListener('click', () => this.clicCheval());

        // Écouteurs pour les achats de nourriture
        boutonNourriture.forEach((bouton, index) => {
            bouton.addEventListener('click', () => this.acheterNourriture(index));
        });

        // Écouteurs pour les achats de pâtures
        boutonPatures.forEach((bouton, index) => {
            bouton.addEventListener('click', () => this.acheterPature(index));
        });
    }

    clicCheval() {
        // Gain de base par clic
        const gainBase = 1 * this.cheval.niveau;
        
        // Bonus basé sur le bonheur du cheval
        const bonusBonheur = Math.floor(this.cheval.bonheur / 10);
        
        this.argent += gainBase + bonusBonheur;
        
        // Diminution légère de l'énergie et du bonheur
        this.cheval.energie = Math.max(0, this.cheval.energie - 1);
        this.cheval.bonheur = Math.max(0, this.cheval.bonheur - 0.5);

        // Mécanisme de montée de niveau
        if (this.argent >= 100 * this.cheval.niveau) {
            this.cheval.niveau++;
        }

        this.mettreAJourAffichage();
    }

    acheterNourriture(index) {
        const nourriture = this.ameliorations.nourriture[index];
        
        if (this.argent >= nourriture.prix) {
            this.argent -= nourriture.prix;
            
            // Augmentation du niveau de nourriture
            nourriture.niveau++;
            
            // Application des effets de la nourriture
            this.cheval.sante = Math.min(100, this.cheval.sante + nourriture.effet.sante);
            this.cheval.energie = Math.min(100, this.cheval.energie + nourriture.effet.energie);
            this.cheval.bonheur = Math.min(100, this.cheval.bonheur + 5);
            
            // Augmentation du prix de la nourriture
            nourriture.prix = Math.floor(nourriture.prix * 1.2);
            
            this.mettreAJourAffichage();
        }
    }

    acheterPature(index) {
        const pature = this.ameliorations.patures[index];
        
        if (this.argent >= pature.prix) {
            this.argent -= pature.prix;
            
            // Augmentation du niveau de pâture
            pature.niveau++;
            
            // Application des effets de la pâture
            this.cheval.bonheur = Math.min(100, this.cheval.bonheur + pature.effet.bonheur);
            
            // Augmentation du prix de la pâture
            pature.prix = Math.floor(pature.prix * 1.5);
            
            this.mettreAJourAffichage();
        }
    }

    mettreAJourAffichage() {
        // Mise à jour de l'affichage de l'argent
        document.querySelector('.MoneyAmmount').textContent = `${this.argent.toFixed(2)} $`;

        // Mise à jour du panneau de statistiques
        const panneauStats = document.querySelector('.StatPanel');
        panneauStats.innerHTML = `
            <h2>Stats du Cheval</h2>
            <p>Niveau: ${this.cheval.niveau}</p>
            <p>Santé: ${this.cheval.sante.toFixed(0)}%</p>
            <p>Énergie: ${this.cheval.energie.toFixed(0)}%</p>
            <p>Bonheur: ${this.cheval.bonheur.toFixed(0)}%</p>
        `;

        // Mise à jour des boutons de nourriture
        this.ameliorations.nourriture.forEach((nourriture, index) => {
            const boutonNourriture = document.querySelectorAll('.Foods .UpgradeButton')[index];
            const prixNourriture = document.querySelectorAll('.Foods .Price')[index];
            const niveauNourriture = document.querySelectorAll('.Foods .Number')[index];
            
            boutonNourriture.textContent = this.argent >= nourriture.prix ? 'Acheter' : 'Pas assez';
            boutonNourriture.disabled = this.argent < nourriture.prix;
            prixNourriture.textContent = `${nourriture.prix}$`;
            niveauNourriture.textContent = `Niv: ${nourriture.niveau}`;
        });

        // Mise à jour des boutons de pâture
        this.ameliorations.patures.forEach((pature, index) => {
            const boutonPature = document.querySelectorAll('.Upgrade .UpgradeButton')[index];
            const prixPature = document.querySelectorAll('.Upgrade .Price')[index];
            const niveauPature = document.querySelectorAll('.Upgrade .Number')[index];
            
            boutonPature.textContent = this.argent >= pature.prix ? 'Acheter' : 'Pas assez';
            boutonPature.disabled = this.argent < pature.prix;
            prixPature.textContent = `${pature.prix}$`;
            niveauPature.textContent = `Niv: ${pature.niveau}`;
        });
    }
}

// Initialisation du jeu une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
    window.chevalGame = new ChevalClickerGame();
});