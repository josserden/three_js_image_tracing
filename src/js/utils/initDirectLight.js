export const initDirectLight = (directLight, scene) => {
  directLight.position.set(1, 1, 1);
  scene.add(directLight);
};
