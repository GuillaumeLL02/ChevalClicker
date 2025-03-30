// src/js/music-control.js
(function() {
    function createMusicButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '9999';
        
        buttonContainer.innerHTML = `
            <input type="checkbox" id="checkboxInput">
            <label for="checkboxInput" class="toggleSwitch">
                <div class="speaker">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
                        <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" 
                              style="stroke:#fff;stroke-width:5;stroke-linejoin:round;fill:#fff;"></path>
                        <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" 
                              style="fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round"></path>
                    </svg>
                </div>
                <div class="mute-speaker">
                    <svg version="1.0" viewBox="0 0 75 75" stroke="#fff" stroke-width="5">
                        <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" stroke-linejoin="round"></path>
                        <path d="m49,26 20,24m0-24-20,24" fill="#fff" stroke-linecap="round"></path>
                    </svg>
                </div>
            </label>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .toggleSwitch {
                width: 50px;
                height: 50px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgb(39, 39, 39);
                border-radius: 50%;
                cursor: pointer;
                transition-duration: .3s;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.13);
                overflow: hidden;
            }
            #checkboxInput { display: none; }
            .speaker { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 2; transition-duration: .3s; }
            .speaker svg { width: 18px; }
            .mute-speaker { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0; z-index: 3; transition-duration: .3s; }
            .mute-speaker svg { width: 18px; }
            #checkboxInput:checked + .toggleSwitch .speaker { opacity: 0; transition-duration: .3s; }
            #checkboxInput:checked + .toggleSwitch .mute-speaker { opacity: 1; transition-duration: .3s; }
            #checkboxInput:active + .toggleSwitch { transform: scale(0.7); }
            #checkboxInput:hover + .toggleSwitch { background-color: rgb(61, 61, 61); }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(buttonContainer);
    }

    function setupMusic() {
        const isMusicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        createMusicButton();
        
        const checkboxInput = document.getElementById('checkboxInput');
        checkboxInput.checked = !isMusicEnabled;
        
        let backgroundMusic = window.backgroundMusic;
        if (!backgroundMusic) {
            backgroundMusic = new Audio('/src/sound/menu_sound.mp3');
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.5;
            window.backgroundMusic = backgroundMusic;
        }
        
        let isAudioUnlocked = false;

        function unlockAudio() {
            if (!isAudioUnlocked) {
                backgroundMusic.play()
                    .then(() => {
                        isAudioUnlocked = true;
                        console.log("Audio déverrouillé et en lecture");
                    })
                    .catch(error => {
                        console.log("En attente d'interaction utilisateur pour jouer la musique:", error);
                    });
            }
        }

        function updateMusicState() {
            const isMuted = checkboxInput.checked;
            localStorage.setItem('musicEnabled', !isMuted);
            
            if (isMuted) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0; // Réinitialiser au début (optionnel)
            } else {
                if (isAudioUnlocked) {
                    backgroundMusic.play().catch(error => {
                        console.error("Erreur lors de la reprise de la musique:", error);
                    });
                } else {
                    unlockAudio();
                }
            }
        }

        // Synchronisation initiale
        if (isMusicEnabled && backgroundMusic.paused) {
            unlockAudio();
        }

        // Écouteur pour le changement d'état
        checkboxInput.addEventListener('change', updateMusicState);

        // Déverrouillage automatique sur la première interaction utilisateur
        const unlockOnInteraction = () => {
            if (!isAudioUnlocked && isMusicEnabled) {
                unlockAudio();
            }
            // Supprimer les écouteurs après le déverrouillage
            document.removeEventListener('click', unlockOnInteraction);
            document.removeEventListener('keydown', unlockOnInteraction);
        };
        document.addEventListener('click', unlockOnInteraction);
        document.addEventListener('keydown', unlockOnInteraction);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMusic);
    } else {
        setupMusic();
    }
})();