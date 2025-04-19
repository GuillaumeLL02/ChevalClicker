import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

function main() {
    const model3D = document.getElementById('Model3D');
    if (!model3D) {
        console.error("L'élément 'Model3D' est introuvable.");
        return;
    }

    // Initialisation Three.js
    const scene = new THREE.Scene();
    scene.background = null;

    // Caméra configurée pour une vue de jeu clicker
    const camera = new THREE.PerspectiveCamera(50, model3D.clientWidth / model3D.clientHeight, 0.1, 1000);

    // Renderer avec des paramètres optimisés
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setSize(model3D.clientWidth, model3D.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    model3D.appendChild(renderer.domElement);

    // Système d'éclairage adapté pour mettre en valeur le cheval (élément principal)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Lumière principale qui met en valeur le cheval
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    // Lumière d'accentuation pour donner de la profondeur
    const accentLight = new THREE.DirectionalLight(0xffffee, 0.2);
    accentLight.position.set(-5, 5, 3);
    scene.add(accentLight);

    // Positionner la caméra pour une vue parfaite pour cliquer sur le cheval
    camera.position.set(0, 0, 40);
    camera.lookAt(0, 0, 0);

    // Gestionnaire de textures
    const textureLoader = new THREE.TextureLoader();

    // Fonction pour charger les textures avec gestion des erreurs
    const loadTexture = (path) => {
        return textureLoader.load(
            path,
            (texture) => {
                // Optimisations de texture
                texture.encoding = THREE.sRGBEncoding;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            },
            undefined,
            (error) => console.error(`Erreur lors du chargement de la texture ${path}:`, error)
        );
    };

    // Chargement des textures
    const baseColorTexture = loadTexture('/src/assets/textures/Horse_BaseColor.png');
    const normalTexture = loadTexture('/src/assets/textures/Horse_Normal.png');
    const roughnessTexture = loadTexture('/src/assets/textures/Horse_Roughtness.png');

    // Initialiser la GUI
    const gui = new GUI();
    gui.title('Horse Customization');

    const textureSettings = {
        baseIndex: 0,
        normalIndex: 0,
        roughnessIndex: 0
    };

    // Paramètres d'intensité de texture
    const textureIntensity = {
        baseColor: 1,
        normalScale: 1,
        roughness: 0.7
    };

    // Charger le modèle
    const loader = new FBXLoader();
    let horseModel;

    function updateHorseTextures() {
        if (!horseModel) return;

        const loadAndApply = (url, type) => {
            textureLoader.load(url, (texture) => {
                texture.encoding = THREE.sRGBEncoding;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

                horseModel.traverse((child) => {
                    if (child.isMesh) {
                        if (type === 'base') child.material.map = texture;
                        if (type === 'normal') child.material.normalMap = texture;
                        if (type === 'roughness') child.material.roughnessMap = texture;
                        child.material.needsUpdate = true;
                    }
                });
            });
        };

        loadAndApply(baseColorTextures[textureSettings.baseIndex], 'base');
        loadAndApply(normalTextures[textureSettings.normalIndex], 'normal');
        loadAndApply(roughnessTextures[textureSettings.roughnessIndex], 'roughness');
    }
    
    function updateMaterialSettings() {
        if (!horseModel) return;

        horseModel.traverse((child) => {
            if (child.isMesh && child.material) {
                // Appliquer une teinte blanche modulée par l'intensité
                child.material.color.setScalar(textureIntensity.baseColor);

                // Modifier la force du relief (normal map)
                child.material.normalScale.set(textureIntensity.normalScale, textureIntensity.normalScale);

                // Ajuster la rugosité
                child.material.roughness = textureIntensity.roughness;

                child.material.needsUpdate = true;
            }
        });
    }

    const materialFolder = gui.addFolder('Material Settings');
    
    
    // Ajouter les contrôles d'intensité de matériau
    materialFolder.add(textureIntensity, 'baseColor', 0, 2, 0.01)
        .name('Base Color')
        .onChange(updateMaterialSettings);
    
    materialFolder.add(textureIntensity, 'normalScale', 0, 5, 0.1)
        .name('Normal Strength')
        .onChange(updateMaterialSettings);
    
    materialFolder.add(textureIntensity, 'roughness', 0, 1, 0.01)
        .name('Roughness')
        .onChange(updateMaterialSettings);

    // Créer une base visuelle sous le cheval
    function createBase() {
        const baseGeometry = new THREE.CylinderGeometry(7, 7, 1, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.6,
            metalness: 0.2
        });

        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -12;
        base.receiveShadow = true;
        scene.add(base);

        // Ajouter un effet de halo autour de la base
        const haloGeometry = new THREE.RingGeometry(7, 8, 32);
        const haloMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 2,
            side: THREE.DoubleSide
        });

        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.rotation.x = -Math.PI / 2;
        halo.position.y = -12.5;
        scene.add(halo);
    }

    // Fonction pour charger le modèle avec optimisations
    const loadModel = (path, scale, position) => {
        loader.load(
            path,
            (object) => {
                horseModel = object;

                // Configuration du modèle
                horseModel.scale.set(scale.x, scale.y, scale.z);
                horseModel.position.set(position.x, position.y, position.z);

                // Optimisation : Centrer le modèle
                const box = new THREE.Box3().setFromObject(horseModel);
                const center = box.getCenter(new THREE.Vector3());
                horseModel.position.x = position.x - center.x * scale.x;
                horseModel.position.y = position.y - center.y * scale.y;
                horseModel.position.z = position.z - center.z * scale.z;

                // Appliquer les textures et optimisations
                horseModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (child.geometry) {
                            child.geometry.computeVertexNormals();
                        }

                        // Matériau optimisé pour le jeu
                        const newMaterial = new THREE.MeshStandardMaterial({
                            map: baseColorTexture,
                            normalMap: normalTexture,
                            roughnessMap: roughnessTexture,
                            roughness: 0.7,
                            metalness: 0.1,
                            side: THREE.DoubleSide
                        });

                        child.material = newMaterial;
                        child.material.needsUpdate = true;
                    }
                });

                createBase(); // Créer la base visuelle sous le cheval
                scene.add(horseModel);
                console.log("Modèle de cheval chargé avec succès!");
                
                // Appliquer les paramètres initiaux
                updateMaterialSettings();
                updateHorseTextures();
            },
            (xhr) => {
                const progress = Math.floor(xhr.loaded / xhr.total * 100);
                console.log(`Chargement du modèle: ${progress}%`);
            },
            (error) => {
                console.error(`Erreur chargement ${path}:`, error);
            }
        );
    };

    // Charger le modèle optimisé pour un jeu clicker
    loadModel('/src/assets/Horse.fbx', { x: 0.2, y: 0.2, z: 0.2 }, { x: 0, y: -15, z: 0 });

    // Gestion du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderer.setSize(model3D.clientWidth, model3D.clientHeight);
            camera.aspect = model3D.clientWidth / model3D.clientHeight;
            camera.updateProjectionMatrix();
        }, 250);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

// S'assurer que le DOM est chargé avant d'exécuter le code
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}