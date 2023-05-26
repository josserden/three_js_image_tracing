import "../css/style.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { getCaptureScreen } from "./utils/getCaptureScreen.js";
import { handleLightSettingClick } from "./utils/handleLightSettingClick.js";
import { refs } from "./utils/refs.js";

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

// Initialize scene
const initScene = () => {
  scene.background = new THREE.Color(0x222831);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  refs.root.appendChild(renderer.domElement);

  camera.position.set(0, 1, window.innerHeight);

  controls.enableDamping = true;
  controls.update();
  controls.enabled = false;

  directLight.position.set(1, 1, 1);
  scene.add(directLight);
};

// change Background
const changeBackground = () => {
  let file = refs.getBackground.files[0];
  let reader = new FileReader();

  if (!file) return;

  reader.onloadend = () => {
    let bgTexture = new THREE.TextureLoader().load(reader.result);
    let floor = new THREE.Mesh(
      new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 0),
      new THREE.MeshPhongMaterial({ map: bgTexture, transparent: false })
    );

    floor.position.set(0, 0, 0);
    floor.rotation.set(Math.PI / 1, 0, -Math.PI);
    floor.isDraggable = false;
    scene.add(floor);
  };

  reader.readAsDataURL(file);
};

// Handle upload background click
const handleUploadBackgroundClick = (e) => {
  if (!refs.getBackground) return;

  refs.getBackground.click();
  refs.getBackground.addEventListener("change", changeBackground);
};

// Change light color
const handleLightColorChange = (e) => {
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
  window.addEventListener("resize", onWindowResize, true);
};

//Listeners
refs.uploadBackground.addEventListener("click", handleUploadBackgroundClick);
refs.captureScreen.addEventListener("click", () =>
  getCaptureScreen({ renderer, scene, camera })
);
refs.lightRange.addEventListener("change", handleLightColorChange);
refs.lightSetting.addEventListener("click", () =>
  handleLightSettingClick(refs.lightSettingWrapper)
);
window.addEventListener("load", runApp);
