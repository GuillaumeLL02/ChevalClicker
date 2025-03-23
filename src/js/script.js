import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const container = document.getElementById('container3D');
if (container) {
    container.appendChild(renderer.domElement);
} else {
    console.warn("Element #container3D not found.");
}

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 10);

// Controls
const orbit = new OrbitControls(camera, renderer.domElement);

// Scène 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Ajout des lumières
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(-30, 50, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}
addLights(scene);

// Ajout du sol
function addPlane(scene) {
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f7f7, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
}
addPlane(scene);

// Chargement du modèle GLTF
const loader = new GLTFLoader();
loader.load(
    '/src/assets/horse_animations/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(15, 15, 15);
        scene.add(model);
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
    (error) => console.error('Error loading model:', error)
);

// Animation
function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
}
animate();

// Gestion des pages
const gameUI = document.getElementById('game-ui');
const cheval3D = document.getElementById('cheval-3d');
const to3dBtn = document.getElementById('to-3d-btn');
const backToUiBtn = document.getElementById('back-to-ui-btn');



if (to3dBtn) {
    to3dBtn.addEventListener('click', () => {
        gameUI.style.display = 'none';
        cheval3D.style.display = 'block';
    });
}

if (backToUiBtn) {
    backToUiBtn.addEventListener('click', () => {
        cheval3D.style.display = 'none';
        gameUI.style.display = 'block';
    });
}

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});