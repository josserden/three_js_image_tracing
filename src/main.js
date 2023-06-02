import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Global variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer();
const pointLight = new THREE.PointLight(0xffffff, 0.25, 100);
const light = new THREE.DirectionalLight(0xffffff, 0.25);
// const controls = new OrbitControls(camera, renderer.domElement);

pointLight.position.set(1, 1, 5);
light.position.set(1, 1, 1);

// Add loaders
const lampLoader = new OBJLoader();
const chairLoader = new OBJLoader();
const sofaLoader = new OBJLoader();

// Add textures
const lampTexture = new THREE.TextureLoader().load('./src/textures/lamp.jpeg');
const chairTexture = new THREE.TextureLoader().load(
  './src/textures/chair.jpeg'
);

// Add materials
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

// Add geometries
const wallGeometry = new THREE.BoxGeometry(10, 3, 0.1);
const floorGeometry = new THREE.BoxGeometry(10, 0.1, 6);
const ceilingGeometry = new THREE.BoxGeometry(6, 0.1, 6);

const walls = new THREE.Mesh(wallGeometry, wallMaterial);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

// Get sizes
const wallsSize = new THREE.Box3()
  .setFromObject(walls)
  .getSize(new THREE.Vector3());
const floorSize = new THREE.Box3()
  .setFromObject(floor)
  .getSize(new THREE.Vector3());
const ceilingSize = new THREE.Box3()
  .setFromObject(ceiling)
  .getSize(new THREE.Vector3());

// Add variables for the objects
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};
let lamp = null;
let chair = null;
let sofa = null;

// Set positions
walls.position.x = scene.position.x;
walls.position.y = scene.position.y + wallsSize.y / 2 - floorSize.y / 2;
walls.position.z = -(floor.position.z + floorSize.z / 2 + wallsSize.z / 2);

floor.position.x = scene.position.x;
floor.position.y = scene.position.y;
floor.position.z = scene.position.z;

ceiling.position.y = scene.position.y + wallsSize.y / 2 - ceilingSize.y / 2;

// Set camera position
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 4.5;

// Add objects to the scene
scene.add(walls);
scene.add(floor);
// scene.add(ceiling);
scene.add(pointLight);
scene.add(light);

// Load models
lampLoader.load('./src/models/lamp.obj', obj => {
  const lampSize = new THREE.Box3()
    .setFromObject(obj)
    .getSize(new THREE.Vector3());

  obj.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = lampMaterial;
    }
  });

  obj.scale.set(0.003, 0.003, 0.003);
  obj.rotation.y = -0.65;

  const lampPosX = obj.scale.x * 400;
  const lampPosY = 0;
  const lampPosZ = -floorSize.z / 2 + (lampSize.z / 2) * obj.scale.z;

  obj.position.set(lampPosX, lampPosY, lampPosZ);
  lamp = obj;

  scene.add(lamp);
});

chairLoader.load('./src/models/chair.obj', obj => {
  const chairSize = new THREE.Box3()
    .setFromObject(obj)
    .getSize(new THREE.Vector3());

  obj.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = chairMaterial;
    }
  });

  obj.scale.set(0.004, 0.004, 0.004);
  obj.rotation.y = -3.15;

  const chairPosX = floorSize.x / 2 - (chairSize.x / 2) * obj.scale.x;
  const chairPosY = 0;
  const chairPosZ = -((floorSize.z / 2) * obj.scale.z);

  obj.position.set(chairPosX, chairPosY, chairPosZ);

  chair = obj;

  scene.add(chair);
});

sofaLoader.load('./src/models/sofa.obj', obj => {
  const sofaSize = new THREE.Box3()
    .setFromObject(obj)
    .getSize(new THREE.Vector3());

  obj.scale.set(0.0025, 0.0025, 0.0025);

  const sofaPosX = (floorSize.x / 2 - sofaSize.x / 2) * obj.scale.x;
  const sofaPosY = 0;
  const sofaPosZ = -(sofaSize.z / 2) * obj.scale.z;

  obj.position.set(sofaPosX, sofaPosY, sofaPosZ);

  sofa = obj;
  scene.add(sofa);
});

const animate = () => {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
};

animate();

// Add mouse events
renderer.domElement.addEventListener('mousedown', event => {
  const mousePosition = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: -(event.clientY / window.innerHeight) * 2 + 1,
  };

  raycaster.setFromCamera(mousePosition, camera);
  const intersectsLamp = raycaster.intersectObjects([lamp]);

  if (!!intersectsLamp.length) {
    isDragging = true;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }
});

renderer.domElement.addEventListener('mousemove', event => {
  if (isDragging && lamp) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };
    const newPosition = {
      x: lamp.position.x + deltaMove.x * 0.01,
      y: lamp.position.y - deltaMove.y * 0.01,
    };
    const sofaSize = new THREE.Box3()
      .setFromObject(sofa)
      .getSize(new THREE.Vector3());

    console.log(floor.position.x);
    console.log(floorSize.x / 2);
    console.log(sofaSize.x / 2);

    const minPosY = floor.position.y + floorSize.y / 2;
    const maxPosX = 0;

    if (newPosition.y < minPosY) {
      newPosition.y = minPosY;
    }

    // if (newPosition.x > maxPosX) {
    //   newPosition.x = maxPosX;
    // }

    lamp.position.x = newPosition.x;
    lamp.position.y = newPosition.y;

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }
});

renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
});
