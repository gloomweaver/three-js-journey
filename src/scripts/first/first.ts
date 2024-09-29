import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";

import doorColorImg from "./textures/door/color.jpg";
import doorAoImg from "./textures/door/ambientOcclusion.jpg";
import doorHeightImg from "./textures/door/height.jpg";
import metalnessImg from "./textures/door/metalness.jpg";
import roughnessImg from "./textures/door/roughness.jpg";
import normalImg from "./textures/door/normal.jpg";

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
  const ambientOcclusionDoorTexture = textureLoader.load(doorAoImg.src);
  const heightDoorTexture = textureLoader.load(doorHeightImg.src);
  const metalnessMapTexture = textureLoader.load(metalnessImg.src);
  const roughnessMapTexture = textureLoader.load(roughnessImg.src);
  const normalMapTexture = textureLoader.load(normalImg.src);

  const rgbeLoader = new RGBELoader(manager);
  rgbeLoader.load("/environmentMap/2k.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
  });

  textureDoorColor.colorSpace = THREE.SRGBColorSpace;

  // MATERIALS
  const material = new THREE.MeshStandardMaterial({
    // map: textureDoorColor,
    metalnessMap: metalnessMapTexture,
    roughnessMap: roughnessMapTexture,
    map: textureDoorColor,
    metalness: 1,
    roughness: 1,
    aoMap: ambientOcclusionDoorTexture,
    displacementMap: heightDoorTexture,
    displacementScale: 0.1,
    normalMap: normalMapTexture,
    normalScale: new THREE.Vector2(5, 5),
    side: THREE.DoubleSide,
  });

  // MESHES
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 64, 64),
    material
  );
  torus.position.x = -2;
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
  );
  sphere.position.x = 2;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
  );
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

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvas!.requestFullscreen();
    }
  }

  window.addEventListener("dblclick", handleFullscreen);

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
