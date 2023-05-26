import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { getCaptureScreen } from './utils/getCaptureScreen.js';
import { handleLightSettingClick } from './utils/handleLightSettingClick.js';
import { initCamera } from './utils/initCamera.js';
import { initControls } from './utils/initControls.js';
import { initDirectLight } from './utils/initDirectLight.js';
import { initRenderer } from './utils/initRenderer.js';
import { refs } from './utils/refs.js';

// Global Variables
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0,
  2000
);
const controls = new OrbitControls(camera, renderer.domElement);
const directLight = new THREE.DirectionalLight(0xffffff, 1);
// const pointLight = new THREE.PointLight(0xffffff, 1, 1000);

// Initialize scene
const initScene = () => {
  scene.background = new THREE.Color(0x222831);
  refs.root.appendChild(renderer.domElement);

  // pointLight.position.set(1, 0, 0);
  // scene.add(pointLight);

  initRenderer(renderer);
  initCamera(camera);
  initControls(controls);
  initDirectLight(directLight, scene);
};

// Change Background
const changeBackground = async () => {
  const file = refs.getBackground.files[0];
  if (!file) return;

  try {
    const reader = new FileReader();
    const bgTexture = await new Promise((resolve, reject) => {
      reader.onload = () =>
        resolve(new THREE.TextureLoader().load(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const material = new THREE.Mesh(
      new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 0),
      new THREE.MeshPhysicalMaterial({
        map: bgTexture,
        side: THREE.DoubleSide,
      })
    );

    material.position.set(0, 0, 0);
    material.rotation.set(Math.PI, 0, -Math.PI);

    scene.add(material);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Handle upload background click
const handleUploadBackgroundClick = () => {
  if (!refs.getBackground) return;

  refs.getBackground.click();
  refs.getBackground.addEventListener('change', changeBackground);
};

// Change light color
const handleLightColorChange = e => {
  const { value } = e.target;
  directLight.position.x = value;
};

// Control & change resize Window
const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

// Initialize animation
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// Run app
const runApp = () => {
  initScene();
  animate();
  window.addEventListener('resize', onWindowResize, true);
};

//Listeners
refs.uploadBackground.addEventListener('click', handleUploadBackgroundClick);
refs.captureScreen.addEventListener('click', () =>
  getCaptureScreen({ renderer, scene, camera })
);
refs.lightRange.addEventListener('input', handleLightColorChange);
refs.lightSetting.addEventListener('click', () =>
  handleLightSettingClick(refs.lightSettingWrapper)
);
window.addEventListener('load', runApp);
