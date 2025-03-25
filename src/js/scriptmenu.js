import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Préférer const à let quand possible et regrouper les initialisations
const scene = new THREE.Scene();

function updateCamera() {
    camera.updateProjectionMatrix();
  }
   
  const gui = new GUI();
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

  
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
});

// Configuration initiale efficace
scene.background = new THREE.Color(0xffffff);
camera.position.set(100, 17, 46);
camera.lookAt(0, 0, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimisation pour écrans retina
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


// Éclairage optimisé
scene.add(new THREE.AmbientLight(0xffffff, 0.7)); // Réduction d'intensité
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Configuration DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // CDN public
dracoLoader.setDecoderConfig({ type: 'js' }); // Utilise le décodeur JS

// Configuration GLTFLoader avec DRACO
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const loadModel = (path, scale, position) => {
    loader.load(
        path,
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(scale.x, scale.y, scale.z);
            model.position.set(position.x, position.y, position.z);
        })
};

// Charger le modèle une seule fois au démarrage
loadModel('src/assets/LowPolyTrees.glb', { x: 20, y: 20, z: 20 }, { x: 0, y: 0, z: 0 });

// Gestion optimisée du redimensionnement
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation avec mise à jour des OrbitControls
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();

// UI avec vérification rapide
const menuContainer = document.getElementById('menu-container');
menuContainer.appendChild(renderer.domElement);

const gameUI = document.getElementById('game-ui');
const startBtn = document.getElementById('start-game-btn');

startBtn?.addEventListener('click', () => {
    menuContainer.style.display = 'none';
    gameUI.style.display = 'block';
    startBtn.style.display = 'none';
});