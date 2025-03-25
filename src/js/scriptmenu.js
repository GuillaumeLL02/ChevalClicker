import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

function main() {
    // Initialisation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Configuration de la caméra
    camera.position.set(90, 9, 30);
    camera.lookAt(0, 0, 0);

    // Configuration du renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Ajout du renderer au menu-container
    const menuContainer = document.getElementById('menu-container');
    menuContainer.appendChild(renderer.domElement);

    // Gestion du chargement avec LoadingManager
    const loadingManager = new THREE.LoadingManager();
    const progressContainer = document.querySelector('.progress-bar-container');
    const loadingBar = document.querySelector('.div');
    const startBtn = document.getElementById('start-game-btn');

    loadingManager.onStart = () => {
        console.log('Début du chargement');
        progressContainer.style.display = 'flex';
        startBtn.style.display = 'none';
        loadingBar.style.backgroundPosition = '100% 0'; // 0% chargé
    };

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal;
        const percentage = (1 - progress) * 100;
        loadingBar.style.backgroundPosition = `${percentage}% 0`;
        console.log(`Chargement : ${itemsLoaded}/${itemsTotal} - ${(progress * 100).toFixed(2)}%`);
    };

    loadingManager.onLoad = () => {
        console.log('Chargement terminé');
        loadingBar.style.backgroundPosition = '0% 0'; // 100% chargé
        progressContainer.style.display = 'none'; // Disparition immédiate
        startBtn.style.display = 'block';
    };

    loadingManager.onError = (url) => {
        console.error(`Erreur lors du chargement de : ${url}`);
    };

    // Ajout d'un background avec une texture
    const textureLoader = new THREE.TextureLoader(loadingManager);
    textureLoader.load(
        '/src/images/sky_image.jpg',
        (texture) => {
            scene.background = texture;
        },
        undefined,
        (error) => {
            console.error('Erreur lors du chargement du background :', error);
            scene.background = new THREE.Color(0x87ceeb);
        }
    );

    // Éclairage
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Configuration DRACOLoader et GLTFLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);

    // Fonction pour charger le modèle
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
                        if (child.name.toLowerCase().includes('water')) {
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
                renderer.render(scene, camera);
            },
            undefined,
            (error) => console.error(`Erreur chargement ${path} :`, error)
        );
    };

    // Charger le modèle
    loadModel('src/assets/LowPolyTrees.glb', { x: 20, y: 20, z: 20 }, { x: 0, y: 0, z: 0 });

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Boucle d'animation
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Transition vers game-ui
    const gameUI = document.getElementById('game-ui');
    startBtn.addEventListener('click', () => {
        menuContainer.style.display = 'none';
        gameUI.style.display = 'block';
        startBtn.style.display = 'none';
        // Assure que la barre reste masquée dans la nouvelle scène
        progressContainer.style.display = 'none';
    });
}

// Lancer l'application
main();