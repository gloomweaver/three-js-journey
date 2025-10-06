import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export function setupBasicScene() {
  const scene = new THREE.Scene();
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    throw new Error("Canvas not found");
  }

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 6;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  let timeout: NodeJS.Timeout;
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

  return { scene, camera, renderer, controls };
}
