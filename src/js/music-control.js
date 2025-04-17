// Module de contrôle de musique
class MusicController {
    constructor() {
        this.musicToggle = document.getElementById('music-toggle');
        this.backgroundMusic = null;
        this.isAudioUnlocked = false;
        
        // Vérifier si la musique était activée précédemment
        this.isMusicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        
        // Initialiser l'état du bouton
        if (this.musicToggle) {
            this.musicToggle.checked = !this.isMusicEnabled;
            this.musicToggle.addEventListener('change', () => this.updateMusicState());
        }
        
        // Initialiser la musique
        this.initializeAudio();
        
        // Déverrouiller l'audio à la première interaction
        this.setupAudioUnlock();
    }
    
    initializeAudio() {
        // Créer l'élément audio s'il n'existe pas déjà
        if (!window.backgroundMusic) {
            this.backgroundMusic = new Audio('/src/sound/menu_sound.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.5;
            window.backgroundMusic = this.backgroundMusic;
        } else {
            this.backgroundMusic = window.backgroundMusic;
        }
        
        // Si la musique doit être activée, essayer de la jouer
        if (this.isMusicEnabled) {
            this.playMusic();
        }
    }
    
    playMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.play()
                .then(() => {
                    this.isAudioUnlocked = true;
                    console.log("Musique démarrée avec succès");
                })
                .catch(error => {
                    console.log("En attente d'interaction utilisateur pour jouer la musique:", error);
                });
        }
    }
    
    pauseMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
    
    updateMusicState() {
        const isMuted = this.musicToggle.checked;
        localStorage.setItem('musicEnabled', !isMuted);
        this.isMusicEnabled = !isMuted;
        
        if (isMuted) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }
    
    setupAudioUnlock() {
        // Fonction qui sera appelée à la première interaction
        const unlockAudio = () => {
            if (!this.isAudioUnlocked && this.isMusicEnabled) {
                this.playMusic();
            }
            // Supprimer les écouteurs une fois l'audio déverrouillé
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        
        // Ajouter des écouteurs pour déverrouiller l'audio
        document.addEventListener('click', unlockAudio);
        document.addEventListener('keydown', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
    }
}

// Initialiser le contrôleur de musique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.musicController = new MusicController();
});

// Exporter la classe si nécessaire pour d'autres modules
export default MusicController;