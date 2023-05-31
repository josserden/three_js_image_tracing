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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const lampLoader = new OBJLoader();
const chairLoader = new OBJLoader();
const sofaLoader = new OBJLoader();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const wallMaterial = new THREE.MeshBasicMaterial({
  color: 0xd3d3d3,
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
scene.add(ambientLight);

lampLoader.load('./src/models/lamp.obj', lamp => {
  lamp.scale.set(0.0025, 0.0025, 0.0025);

  lamp.rotation.y = -3.5;

  lamp.position.x = 2;
  lamp.position.y = -1;
  lamp.position.z = 2;

  scene.add(lamp);
});

chairLoader.load('./src/models/chair.obj', chair => {
  chair.scale.set(0.002, 0.002, 0.002);
  chair.rotation.y = -3;

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
