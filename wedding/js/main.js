/**
 * main.js - Application Entry Point & Orchestrator
 */

(function () {
  'use strict';

  // 1. Container, Scene & Camera Setup
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();

  const initialWidth = container.clientWidth || window.innerWidth;
  const initialHeight = container.clientHeight || window.innerHeight;

  const initialDistance = getResponsiveCameraDistance(container);
  const camera = new THREE.PerspectiveCamera(
    60,
    initialWidth / initialHeight,
    0.1,
    3000
  );
  camera.position.set(0, 0, initialDistance);

  // 2. WebGL Renderer sized to Mobile Frame Container
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    alpha: true
  });
  renderer.setSize(initialWidth, initialHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NoToneMapping;
  container.appendChild(renderer.domElement);

  // 3. Initialize Modular Components
  const heart = createHeartSystem(renderer, initialDistance);
  scene.add(heart.mesh);

  // Position heart slightly upward for balanced aesthetic composition
  const HEART_UP_OFFSET_RATIO = 0.105;
  function updateHeartVerticalPosition() {
    const vFov = (camera.fov * Math.PI) / 180;
    const totalHeightUnits = 2 * Math.tan(vFov / 2) * camera.position.z;
    heart.mesh.position.y = totalHeightUnits * HEART_UP_OFFSET_RATIO;
  }
  updateHeartVerticalPosition();

  const calligraphy = createCalligraphy(heart.mesh);
  const rosePetals = typeof createRosePetals === 'function' ? createRosePetals(scene, camera) : null;

  // 4. Animation Loop
  const clock = new THREE.Clock();
  let lastTime = 0;

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const dt = Math.min(elapsedTime - lastTime, 0.05) || 0.016;
    lastTime = elapsedTime;

    // Timeline calculation for heart ribbon reveal
    let morphProgress = 1.0;
    if (elapsedTime < CONFIG.TIMELINE.HEART_FORM_END) {
      morphProgress = elapsedTime / CONFIG.TIMELINE.HEART_FORM_END;
    } else {
      morphProgress = 1.0;
    }

    // Update Components
    heart.update(elapsedTime, morphProgress);
    calligraphy.update(elapsedTime);
    if (rosePetals) {
      rosePetals.update(dt, elapsedTime);
    }

    // Autonomous gentle 3D scene sway for organic depth
    heart.mesh.rotation.y = Math.sin(elapsedTime * 0.08) * 0.09;
    heart.mesh.rotation.x = Math.cos(elapsedTime * 0.06) * 0.038;

    renderer.render(scene, camera);
  }

  // 5. Responsive Resize & Orientation Handler
  function handleResize() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const targetDistance = getResponsiveCameraDistance(container);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, targetDistance);

    updateHeartVerticalPosition();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const pixelRatio = renderer.getPixelRatio();
    const pointScale = 280.0 * (targetDistance / CONFIG.BASE_DESKTOP_DISTANCE);

    heart.updateScale(pointScale, pixelRatio);
    if (rosePetals) {
      rosePetals.handleResize();
    }
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 120);
  });

  // 6. Name Box Interactive Text Controller
  const nameBox = document.getElementById('wedding-name-box');
  const nameInput = document.getElementById('name-box-input');

  if (nameBox && nameInput) {
    const DEFAULT_NAME = 'ភ្ញៀវកិត្តិយស';

    function autoFitFont() {
      const text = nameInput.textContent.trim();
      if (!text) {
        nameInput.style.fontSize = '';
        return;
      }
      const isMobile = window.innerWidth <= 480;
      let size = isMobile ? 12.8 : 13.0;
      nameInput.style.fontSize = size + 'px';
      while (nameInput.scrollWidth > nameInput.clientWidth && size > 10) {
        size -= 0.5;
        nameInput.style.fontSize = size + 'px';
      }
    }

    // Support optional personalized invitation via URL ?name=... or ?to=...
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlName = urlParams.get('name') || urlParams.get('to');
      if (urlName) {
        nameInput.textContent = urlName.trim();
      }
      autoFitFont();
    } catch (e) {}

    window.addEventListener('resize', autoFitFont);
  }

  // 7. E-Invitation Video Controller
  const openBtn = document.getElementById('open-invitation-btn');
  const overlay = document.getElementById('invitation-overlay');
  const video = document.getElementById('invitation-video');

  if (openBtn && overlay && video) {
    function openInvitation() {
      overlay.classList.add('active');
      try {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Video play warning:', err);
            video.muted = true;
            video.play();
          });
        }
      } catch (err) {
        console.warn('Video play error:', err);
      }
    }

    // Keep water waving and vines swinging continuously when video reaches the end
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.3) {
        // Seamlessly loop back into the ambient waving water & swaying vines cycle
        video.currentTime = 9.95;
      }
    });

    video.addEventListener('ended', () => {
      video.currentTime = 9.95;
      try {
        video.play();
      } catch (e) {}
    });

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openInvitation();
    });
  }

  // Start Animation
  animate();
})();
