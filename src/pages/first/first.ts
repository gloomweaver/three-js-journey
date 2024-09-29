import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";

import doorColorImg from "./textures/door/color.jpg";
import matcapImg from "./textures/matcaps/5.png";

export function run() {
  const scene = new THREE.Scene();
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    throw new Error("Canvas not found");
  }

  // LOAD ASSETS
  const manager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(manager);
  const textureDoorColor = textureLoader.load(doorColorImg.src);
  const matcap = textureLoader.load(matcapImg.src);
  const rgbeLoader = new RGBELoader(manager);
  rgbeLoader.load("./environmentMap/2k.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
  });

  textureDoorColor.colorSpace = THREE.SRGBColorSpace;

  // MATERIALS
  const material = new THREE.MeshStandardMaterial({
    // map: textureDoorColor,
    roughness: 0,
    metalness: 1,
    side: THREE.DoubleSide,
  });

  // MESHES
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    material
  );
  torus.position.x = -2;
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  );
  sphere.position.x = 2;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  scene.add(torus, sphere, plane);

  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 6;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // HANDLERS
  let timeout: number;
  function handleResize() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }, 200);
  }

  window.addEventListener("resize", handleResize);

  // GAME LOOP
  const clock = new THREE.Clock();
  function animate() {
    controls.update();

    const elapsedTime = clock.getElapsedTime();

    torus.rotation.y = 0.1 * elapsedTime;
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;

    torus.rotation.x = -0.1 * elapsedTime;
    sphere.rotation.x = -0.1 * elapsedTime;
    plane.rotation.x = -0.1 * elapsedTime;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}
