const SAVE_KEY = 'horseGameSave';

export function saveGame() {
    const gameState = {
        money: 0,
        stamina: 20,
        upgrades: [],
        clickMeter: 0,
        lastSave: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

export function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

export function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

// Exporter une fonction pour modifier l'état et sauvegarder
export function updateState(key, value) {
    gameState[key] = value;
    saveGame();
  }

// Sauvegarde automatique toutes les 30 secondes
setInterval(saveGame, 30000);