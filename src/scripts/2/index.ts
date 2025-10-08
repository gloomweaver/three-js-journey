import * as THREE from "three";
import { setupBasicScene } from "../../lib/setupBasicScene";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json?url";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

async function loadResources() {
  const loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = (_url, loaded, total) => {
    console.log(`Load progress ${loaded}/${total}`);
  };

  const fontLoader = new FontLoader(loadingManager);
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const [textMatcap, font] = await Promise.all([
    textureLoader.loadAsync("/textures/matcaps/1.png"),
    fontLoader.loadAsync(typefaceFont),
  ]);

  textMatcap.colorSpace = "srgb";
  return {
    textMatcap,
    font,
  };
}

function getRandomCoordinate() {
  return 15 * (Math.random() - 0.5);
}

function getRandomRotation() {
  return Math.random() * Math.PI;
}

function addDonuts({
  scene,
  material,
}: {
  scene: THREE.Scene;
  material: THREE.MeshMatcapMaterial;
}) {
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = getRandomCoordinate();
    donut.position.y = getRandomCoordinate();
    donut.position.z = getRandomCoordinate();

    donut.rotation.x = getRandomRotation();
    donut.rotation.y = getRandomRotation();

    const scale = 0.25 + Math.random();
    donut.scale.multiplyScalar(scale);

    scene.add(donut);
  }
}

export async function run() {
  const { scene, renderer, camera, controls } = setupBasicScene();
  const { textMatcap, font } = await loadResources();

  const sharedMaterial = new THREE.MeshMatcapMaterial({ matcap: textMatcap });

  const textGeometry = new TextGeometry("Oh, Hi Mark", {
    font,
    size: 0.5,
    depth: 0.125,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.002,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  // Place geometry in the center of the scene
  textGeometry.center();

  const textMesh = new THREE.Mesh(textGeometry, sharedMaterial);
  scene.add(textMesh);

  addDonuts({
    scene,
    material: sharedMaterial,
  });

  function animate() {
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

run();
