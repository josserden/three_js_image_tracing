export const getCaptureScreen = ({ renderer, scene, camera }) => {
  let now = Date.now();
  let a = document.createElement("a");

  a.download = `Image-Trace-(${now}).jpg`;
  renderer.render(scene, camera);

  a.href = renderer.domElement.toDataURL();
  a.click();
};
