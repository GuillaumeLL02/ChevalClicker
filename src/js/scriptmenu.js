import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Préférer const à let quand possible et regrouper les initialisations
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: false, 
    powerPreference: 'low-power', // Priorité basse consommation
    precision: 'lowp' // Précision basse pour shaders
});
// Configuration initiale efficace
scene.background = new THREE.Color(0xffffff);
camera.position.set(85, 12, 72);
camera.lookAt(0, 0, 0);
console.log('Camera position:', camera.position);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimisation pour écrans retina
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// OrbitControls avec damping pour fluidité
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.05;

// Éclairage optimisé
scene.add(new THREE.AmbientLight(0xffffff, 0.7)); // Réduction d'intensité
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024; // Réduction de la résolution des ombres
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Chargement du modèle avec mise en cache
const loader = new GLTFLoader();
const loadModel = (path, scale, position) => {
    loader.load(
        path,
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(scale.x, scale.y, scale.z);
            model.position.set(position.x, position.y, position.z);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.name.toLowerCase().includes('water') || child.name.toLowerCase().includes('eau')) {
                        child.material = new THREE.MeshStandardMaterial({
                            transparent: true,
                            opacity: 0.7,
                            color: 0x00efff,
                            side: THREE.DoubleSide
                        });
                    }
                }
            });
            scene.add(model);
        },
        undefined,
        (error) => console.error(`Erreur chargement ${path} :`, error)
    );
};

// Charger le modèle une seule fois au démarrage
loadModel('src/assets/LowPolyTrees.glb', { x: 20, y: 20, z: 20 }, { x: 0, y: 0, z: 0 });

// Gestion optimisée du redimensionnement avec debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }, 100);
});
// Affichage FPS
const fpsDisplay = document.createElement('div');
fpsDisplay.style.cssText = 'position:absolute;top:10px;left:10px;color:white;background:rgba(0,0,0,0.5);padding:3px;font-size:12px;';
document.body.appendChild(fpsDisplay);
let frameCount = 0, lastTime = performance.now(), fps = 0;

// Animation ultra-légère
const animate = (time) => {
    requestAnimationFrame(animate);

    // Calcul FPS
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        fpsDisplay.textContent = `FPS: ${fps}`;
    }

    orbit.update();
    renderer.render(scene, camera);
};
requestAnimationFrame(animate);

// UI avec vérification rapide
const mainMenu = document.getElementById('intro-menu');
const gameUI = document.getElementById('game-ui');
const startBtn = document.getElementById('start-game-btn');

startBtn?.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    gameUI.style.display = 'block';
});