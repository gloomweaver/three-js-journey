import * as THREE from "three";
import { setupBasicScene } from "../../lib/setupBasicScene";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json?url";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

export async function run() {
  const { scene, renderer, camera, controls } = setupBasicScene();

  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync(typefaceFont);

  const textGeometry = new TextGeometry("Oh, Hi Mark", {
    font,
    size: 0.5,
    depth: 0.05,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.002,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial());
  scene.add(textMesh);

  const axisHelper = new THREE.AxesHelper(2);
  scene.add(axisHelper);

  function animate() {
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

run();
