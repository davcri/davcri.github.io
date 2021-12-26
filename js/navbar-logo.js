// logo-canvas

function rad2Deg(r) {
  return (r * 180) / Math.PI;
}

let w, h;
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("logo-canvas");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.setSize(canvas.innerWidth, canvas.innerHeight);
  w = canvas.clientWidth;
  h = canvas.clientHeight;
  const minSize = Math.min(w, h);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, w / h, 300, 1000);

  camera.position.z = 600;
  const white = "#F7F7F7";
  scene.background = new THREE.Color(white);
  scene.fog = new THREE.Fog(0xffaaaa, 500, 700);
  const geometry = new THREE.BoxGeometry(minSize / 2, minSize / 2, minSize / 2);
  const geometry2 = new THREE.BoxGeometry(minSize * 0.6, minSize * 0.6, minSize * 0.6);
  const material = new THREE.MeshNormalMaterial();
  // material.fog = new THREE.Fog(0xffaaaa, 500, 700);
  const wireCube = new THREE.Mesh(
    geometry2,
    new THREE.MeshNormalMaterial({
      wireframe: true,
      wireframeLinewidth: 2,
      opacity: 0.2,
      transparent: true,
    })
  );
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  scene.add(wireCube);
  // camera.lookAt(cube.position);

  // listeners
  sizing();
  window.addEventListener("resize", (ev) => {
    sizing();
  });
  let targetPos = new THREE.Vector3();

  window.addEventListener("mousemove", (ev) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ev.clientX - rect.x;
    mouse.y = ev.clientY - rect.y;
    const mouseNormalized = {
      x: (mouse.x / w) * 2 - 1,
      y: -(mouse.y / h) * 2 + 1,
    };

    if (mouseNormalized.y > -5) {
      targetPos.x = mouseNormalized.x * 2;
      targetPos.y = mouseNormalized.y * 2;
    } else {
      targetPos.x = 0;
      targetPos.y = 0;
    }
  });
  function sizing() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    // Update renderer
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Update camera
    camera.aspect = w / h;
    camera.fov = rad2Deg(2 * Math.atan(h / 2 / camera.position.z));
    camera.updateProjectionMatrix();
    canvas.style.width = "100%"
    canvas.style.height = "100%"
  }

  let elapsedTime = 0;
  let mouse = { x: 0, y: 0 };

  function animate() {
    elapsedTime += 0.016;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    wireCube.rotation.copy(cube.rotation);
    cube.position.lerp(targetPos, 0.1);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
