import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Create galaxy stars
function createStars(count) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    positions.push(x, y, z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
}

createStars(1000);

// Example planets
const websites = [
  { name: 'OpenAI', url: 'https://openai.com', color: 0x00ffcc },
  { name: 'Wikipedia', url: 'https://wikipedia.org', color: 0xffffff },
  { name: 'BBC', url: 'https://bbc.co.uk', color: 0xff0000 },
  { name: 'GitHub', url: 'https://github.com', color: 0x8888ff }
];

websites.forEach((site, i) => {
  const geometry = new THREE.SphereGeometry(2, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: site.color });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(Math.cos(i) * 30, Math.sin(i) * 30, 0);
  planet.userData = { url: site.url };

  const labelCanvas = document.createElement('canvas');
  const ctx = labelCanvas.getContext('2d');
  ctx.font = '32px sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText(site.name, 10, 40);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex }));
  label.scale.set(10, 5, 1);
  label.position.copy(planet.position.clone().add(new THREE.Vector3(0, 3, 0)));

  scene.add(planet);
  scene.add(label);
});

// Light
scene.add(new THREE.AmbientLight(0xcccccc));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.userData.url) {
      window.open(intersects[i].object.userData.url, '_blank');
      break;
    }
  }
}

window.addEventListener('click', onClick);

// Animate
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
