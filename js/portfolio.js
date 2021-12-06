function rad2Deg(r) {
  return (r * 180) / Math.PI;
}

let w, h;
w = window.innerWidth;
h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  100,
  1000
);
camera.position.z = 600;
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.left = "0px";
renderer.domElement.style.top = "0px";
// renderer.domElement.style["background-color"] = "rgba(0, 0, 0, 0)";
renderer.domElement.style["z-index"] = "-1";

const white = "#F7F7F7";
scene.background = new THREE.Color(white);

const geometry = new THREE.PlaneGeometry(w * 0.5, h * 0.5, 10, 10);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

sizing();

function sizing() {
  w = window.innerWidth;
  h = window.innerHeight;
  // Update renderer
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Update camera
  camera.aspect = w / h;
  camera.fov = rad2Deg(2 * Math.atan(h / 2 / camera.position.z));
  camera.updateProjectionMatrix();

  // TODO: update geometries?
}

window.addEventListener("resize", (ev) => {
  sizing();
});

let points;
let particlesGeometry;
let positions;
let count = Math.round((w / 10) * (h / 10));
function createPoints() {
  particlesGeometry = new THREE.BufferGeometry(1, 32, 32);
  positions = new Float32Array(count * 3);
  const s = 15; // spacing
  let idx = -3;  
  for (let i = 0; i < Math.round(w / s) + 1; i++) {
    for (let j = 0; j < Math.round(h / s) + 1; j++) {
      idx += 3;
      positions[idx] = i * s - w / 2; // x
      positions[idx + 1] = j * s - h / 2; // y
      positions[idx + 2] = 0; // z
    }
  }

  const colors = new Float32Array(count * 3);
  for (let i = 0; i < colors.length; i++) {
    colors[i] = Math.min(0.99, 0.8 + Math.random());
  }

  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const pointMaterial = new THREE.PointsMaterial({
    size: 10,
    color: new THREE.Color("white"),
    vertexColors: true,
    // depthWrite: false,
  });
  points = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(points);
}

// setup
createPoints();

let elapsedTime = 0;
let mouse = { x: 0, y: 0 };

// listeners
window.addEventListener("mousemove", (ev) => {
  mouse.x = ev.clientX;
  mouse.y = ev.clientY;
  const mouseNormalized = {
    x: (ev.clientX / w) * 2 - 1,
    y: -(ev.clientY / h) * 2 + 1,
  };

  const position = particlesGeometry.attributes.position;
  for (let i = 0; i < count; i++) {
    const x = position.array[i * 3 + 0];
    const y = position.array[i * 3 + 1];
    const z = position.array[i * 3 + 2];

    const px = (mouseNormalized.x * w) / 2;
    const py = (mouseNormalized.y * h) / 2;

    if (Math.abs(px - x) < 100 && Math.abs(py - y) < 100) {
      position.array[i * 3 + 2] = z - 0.25;
    } else {
      position.array[i * 3 + 2] = z - z * 0.25;
    }
    position.needsUpdate = true;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
});

function animate() {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  elapsedTime += 0.016;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
