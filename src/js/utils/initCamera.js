export const initCamera = camera => {
  camera.position.set(0, 1, window.innerHeight);
  camera.lookAt(0, 0, 10);
};
