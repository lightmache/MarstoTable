(function () {
  const canvas = document.getElementById('mars-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const stage = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 100);
  camera.position.z = 3.2;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(stage.clientWidth, stage.clientHeight);

  // Procedural Mars-like surface texture (no image assets)
  function makeMarsTexture() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');

    const base = ctx.createLinearGradient(0, 0, 0, size);
    base.addColorStop(0, '#8a3a1f');
    base.addColorStop(0.5, '#a8461f');
    base.addColorStop(1, '#6e2c16');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // mottled surface blotches
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 14 + 2;
      const shade = Math.random();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = shade > 0.5
        ? `rgba(60, 20, 10, ${Math.random() * 0.25})`
        : `rgba(200, 130, 90, ${Math.random() * 0.18})`;
      ctx.fill();
    }

    // polar caps
    ctx.fillStyle = 'rgba(230, 225, 220, 0.55)';
    ctx.beginPath();
    ctx.ellipse(size / 2, 20, size / 3, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size / 2, size - 16, size / 3.2, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }

  const geometry = new THREE.SphereGeometry(1.15, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: makeMarsTexture(),
    roughness: 0.95,
    metalness: 0.0,
  });
  const mars = new THREE.Mesh(geometry, material);
  scene.add(mars);

  const ambient = new THREE.AmbientLight(0x404550, 1.1);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffe4cc, 1.4);
  key.position.set(4, 2, 3);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x4a8fd9, 0.5);
  rim.position.set(-3, -1, -2);
  scene.add(rim);

  function onResize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    requestAnimationFrame(animate);
    if (!reduceMotion) {
      mars.rotation.y += 0.0025;
    }
    renderer.render(scene, camera);
  }
  animate();
})();
