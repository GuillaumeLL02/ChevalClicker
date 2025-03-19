import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const container = document.getElementById("container3D");
if (container) {
    container.appendChild(renderer.domElement);
} else {
    console.warn("Element #container3D not found. Appending to body instead.");
    document.body.appendChild(renderer.domElement);
}

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);

// 📌 Création des deux scènes
const scene1 = new THREE.Scene();
scene1.background = new THREE.Color(0xaaaaaa);
const scene2 = new THREE.Scene();
scene2.background = new THREE.Color(0x222222);

// 📌 Variable pour suivre la scène active
let activeScene = scene1;

// 📌 Fonction pour ajouter les lumières aux scènes
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(-30, 50, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}
addLights(scene1);
addLights(scene2);

// 📌 Chargement des modèles
const loader = new GLTFLoader();
function loadModel(scene, url, position, scale) {
    loader.load(url, (gltf) => {
        const model = gltf.scene;
        model.position.set(position.x, position.y, position.z);
        model.scale.set(scale.x, scale.y, scale.z);
        scene.add(model);
    }, 
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    (error) => {
        console.error("Error loading model:", error);
    });
}

// 📌 Ajouter des modèles différents aux deux scènes
loadModel(scene1, 'src/assets/horse_animations/scene.gltf', { x: 0, y: 0, z: 0 }, { x: 15, y: 15, z: 15 });
loadModel(scene1, 'src/assets/shiba/scene.gltf', { x: -5, y: 0, z: -5 }, { x: 12, y: 12, z: 12 });

loadModel(scene2, 'src/assets/armored_horse/scene.gltf', { x: 5, y: 1, z: 5 }, { x: 1, y: 1, z: 1 });

// 📌 Création du sol pour chaque scène
function addPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f7f7, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
}
addPlane(scene1);
addPlane(scene2);

// 📌 Ajout des Helpers (Grille, Axes)
scene1.add(new THREE.GridHelper(20, 5));
scene1.add(new THREE.AxesHelper(5));

scene2.add(new THREE.GridHelper(20, 5));
scene2.add(new THREE.AxesHelper(5));

// 📌 Animation Loop
function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    renderer.render(activeScene, camera);
}
animate();

// 📌 Gestion du changement de scène
const button = document.createElement('button');
button.innerText = 'Changer de scène';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.left = '10px';
button.style.padding = '10px';
button.style.backgroundColor = '#fff';
button.style.border = '1px solid #000';
button.style.cursor = 'pointer';
document.body.appendChild(button);

button.addEventListener('click', () => {
    activeScene = activeScene === scene1 ? scene2 : scene1;
});

// 📌 Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
