import * as THREE from "three";
import gsap from "gsap";

export function run() {
  const scene = new THREE.Scene();
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    throw new Error("Canvas not found");
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

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

  gsap
    .to(mesh.position, { x: 2, y: 2, duration: 2 })
    .then(() => {
      return gsap.to(mesh.position, { x: -2, y: 2, duration: 2 });
    })
    .then(() => {
      return gsap.to(mesh.position, { x: -2, y: -2, duration: 2 });
    })
    .then(() => {
      return gsap.to(mesh.position, { x: 2, y: -2, duration: 2 });
    })
    .then(() => {
      return gsap.to(mesh.position, { x: 0, y: 0, duration: 2 });
    });

  function animate() {
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", handleResize);

  animate();
}
