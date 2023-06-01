import './style.css';

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
const pointLight = new THREE.PointLight(0xffffff, 0.3);
const light = new THREE.DirectionalLight(0xffffff, 0.1);

pointLight.position.set(1, 1, 5);
light.position.set(0, 0, 5);

const lampLoader = new OBJLoader();
const chairLoader = new OBJLoader();
const sofaLoader = new OBJLoader();

const lampTexture = new THREE.TextureLoader().load('./src/textures/lamp.jpeg');
const chairTexture = new THREE.TextureLoader().load(
  './src/textures/chair.jpeg'
);

const lampMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.1,
  roughness: 1,
  map: lampTexture,
});
const chairMaterial = new THREE.MeshPhysicalMaterial({
  roughness: 0.1,
  map: chairTexture,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const wallMaterial = new THREE.MeshBasicMaterial({
  color: 0x9c9ea9,
});
const floorMaterial = new THREE.MeshBasicMaterial({
  color: 0x808080,
});
const ceilingMaterial = new THREE.MeshBasicMaterial({
  color: 0xf2f2f2,
});

const wallGeometry = new THREE.BoxGeometry(12.75, 5.75, 0.5);
const floorGeometry = new THREE.BoxGeometry(6, 0.2, 6);
const ceilingGeometry = new THREE.BoxGeometry(6, 0.2, 6);

const walls = new THREE.Mesh(wallGeometry, wallMaterial);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

walls.position.z = 0.5;
floor.position.y = -1.25;
ceiling.position.y = 1.25;

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;

scene.add(walls);
scene.add(floor);
scene.add(ceiling);
scene.add(pointLight);
scene.add(light);

lampLoader.load('./src/models/lamp.obj', lamp => {
  lamp.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = lampMaterial;
    }
  });

  lamp.scale.set(0.0025, 0.0025, 0.0025);

  lamp.rotation.y = -1;

  lamp.position.x = 1.95;
  lamp.position.y = -0.95;
  lamp.position.z = 2;

  scene.add(lamp);
});

chairLoader.load('./src/models/chair.obj', chair => {
  chair.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = chairMaterial;
    }
  });

  chair.scale.set(0.002, 0.002, 0.002);
  chair.rotation.y = -3.15;

  chair.position.x = 2.25;
  chair.position.y = -1;
  chair.position.z = 3;

  scene.add(chair);
});

sofaLoader.load('./src/models/sofa.obj', sofa => {
  sofa.scale.set(0.0012, 0.0012, 0.0012);

  sofa.position.x = -1.35;
  sofa.position.y = -0.95;
  sofa.position.z = 2;

  scene.add(sofa);
});

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
