class FullscreenManager {
    constructor() {
        this.initializeFullscreenElements();
        this.addEventListeners();
    }

    initializeFullscreenElements() {
        // Créer le bouton de plein écran
        this.createFullscreenButton();
    }

    createFullscreenButton() {
        // Créer un bouton de plein écran
        const fullscreenButton = document.createElement('button');
        fullscreenButton.id = 'fullscreen-toggle';
        fullscreenButton.innerHTML = '🖥️'; // Icône de plein écran
        fullscreenButton.style.position = 'fixed';
        fullscreenButton.style.top = '10px';
        fullscreenButton.style.right = '10px';
        fullscreenButton.style.zIndex = '1000';
        fullscreenButton.style.background = 'rgba(0,0,0,0.5)';
        fullscreenButton.style.color = 'white';
        fullscreenButton.style.border = 'none';
        fullscreenButton.style.borderRadius = '5px';
        fullscreenButton.style.padding = '10px';
        fullscreenButton.style.cursor = 'pointer';

        // Ajouter le bouton au body
        document.body.appendChild(fullscreenButton);
    }

    addEventListeners() {
        const fullscreenButton = document.getElementById('fullscreen-toggle');
        
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                this.enterFullscreen();
            } else {
                this.exitFullscreen();
            }
        });

        // Écouter les changements d'état de plein écran
        document.addEventListener('fullscreenchange', () => {
            this.updateFullscreenButtonState();
        });
    }

    enterFullscreen() {
        const element = document.documentElement; // Tout l'écran

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // Internet Explorer/Edge
            element.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // Internet Explorer/Edge
            document.msExitFullscreen();
        }
    }

    updateFullscreenButtonState() {
        const fullscreenButton = document.getElementById('fullscreen-toggle');
        if (document.fullscreenElement) {
            fullscreenButton.textContent = '↙️'; // Icône de sortie plein écran
        } else {
            fullscreenButton.textContent = '🖥️'; // Icône de plein écran
        }
    }
}

// Initialisation du gestionnaire de plein écran
document.addEventListener('DOMContentLoaded', () => {
    window.fullscreenManager = new FullscreenManager();
});