/**
 * rosePetals.js - Realistic 3D Falling Rose Petal System
 * Romantic, drifting rose petals tumbling naturally in the breeze from top to bottom
 */

(function () {
  'use strict';

  /**
   * Helper to generate a realistic rose petal canvas texture
   */
  function createPetalTexture(highlightColor, midColor, edgeColor, veinColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 128, 128);

    ctx.save();
    ctx.translate(64, 64);

    // Natural curved rose petal contour
    ctx.beginPath();
    ctx.moveTo(0, 50); // Stem base
    ctx.bezierCurveTo(-38, 38, -52, 10, -48, -18);
    ctx.bezierCurveTo(-44, -42, -24, -54, 0, -48);
    ctx.bezierCurveTo(24, -54, 44, -42, 48, -18);
    ctx.bezierCurveTo(52, 10, 38, 38, 0, 50);
    ctx.closePath();

    // Velvety radial gradient
    const grad = ctx.createRadialGradient(-6, -14, 4, 0, 0, 56);
    grad.addColorStop(0.0, highlightColor);
    grad.addColorStop(0.45, midColor);
    grad.addColorStop(0.9, edgeColor);
    grad.addColorStop(1.0, edgeColor);

    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle petal veins for natural organic depth
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 1.0;
    ctx.globalAlpha = 0.25;

    ctx.beginPath();
    // Central spine
    ctx.moveTo(0, 48);
    ctx.quadraticCurveTo(-2, 0, 0, -44);
    // Left & right delicate branches
    ctx.moveTo(0, 25);
    ctx.quadraticCurveTo(-18, 10, -32, -6);
    ctx.moveTo(0, 10);
    ctx.quadraticCurveTo(-22, -10, -34, -28);
    ctx.moveTo(0, 25);
    ctx.quadraticCurveTo(18, 10, 32, -6);
    ctx.moveTo(0, 10);
    ctx.quadraticCurveTo(22, -10, 34, -28);
    ctx.stroke();

    // Soft rim highlight on the petal lip
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = 'rgba(255, 220, 230, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -44, 18, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  /**
   * Factory function to create the Falling Rose Petals Component
   */
  function createRosePetals(scene, camera) {
    const group = new THREE.Group();
    group.name = 'rose-petals-group';
    scene.add(group);

    // 3 Curated varieties of rose petals matching royal wedding bouquet palette
    const textures = [
      createPetalTexture('#b51d3b', '#800d23', '#4d0412', 'rgba(77, 4, 18, 0.4)'), // Royal Velvet Burgundy
      createPetalTexture('#cf3857', '#9e1430', '#63081b', 'rgba(99, 8, 27, 0.4)'), // Crimson Velvet
      createPetalTexture('#f2a5b2', '#d95d76', '#8a1128', 'rgba(138, 17, 40, 0.35)') // Antique Blush Rose
    ];

    const materials = textures.map(tex => new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      depthWrite: false
    }));

    // Cupped petal geometry for realistic 3D curvature
    function createCuppedGeometry(width, height) {
      const geo = new THREE.PlaneGeometry(width, height, 4, 4);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Subtle concave cup curve
        const cup = -((x * x) / (width * width) + (y * y) / (height * height)) * 1.8;
        pos.setZ(i, cup);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const baseGeometry = createCuppedGeometry(6.2, 7.8);

    const PETAL_COUNT = 48;
    const petals = [];

    // Viewport calculations helper
    function getBounds() {
      if (typeof getViewportLimits === 'function' && camera) {
        const limits = getViewportLimits(camera);
        return {
          top: limits.screenTop + 16,
          bottom: limits.screenBottom - 16,
          halfWidth: limits.halfWidth * 1.15
        };
      }
      return { top: 90, bottom: -90, halfWidth: 55 };
    }

    let bounds = getBounds();

    for (let i = 0; i < PETAL_COUNT; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(baseGeometry, mat);

      // Petite, delicate scale variation
      const scale = 0.6 + Math.random() * 0.55;
      mesh.scale.set(scale, scale, scale);

      // Distribute initially throughout the full vertical span
      const x = (Math.random() - 0.5) * bounds.halfWidth * 2;
      const y = bounds.bottom + Math.random() * (bounds.top - bounds.bottom);
      const z = -10 + Math.random() * 28;

      mesh.position.set(x, y, z);

      // Initial random 3D rotations
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Individual aerodynamic characteristics
      const petalData = {
        mesh: mesh,
        baseX: x,
        y: y,
        z: z,
        scale: scale,
        fallSpeed: 16.0 + Math.random() * 18.0,    // Delicate, floating downward drift
        driftAmpX: 5.5 + Math.random() * 7.5,      // Horizontal breeze sway amplitude
        driftFreqX: 0.65 + Math.random() * 0.75,   // Horizontal sway frequency
        driftPhaseX: Math.random() * Math.PI * 2,
        rotSpeedX: 1.0 + Math.random() * 1.8,      // End-over-end tumbling
        rotSpeedY: 1.1 + Math.random() * 2.0,      // 3D spinning
        rotSpeedZ: 0.7 + Math.random() * 1.2,      // Swaying tilt
        rotPhase: Math.random() * Math.PI * 2
      };

      petals.push(petalData);
      group.add(mesh);
    }

    /**
     * Update animation frame
     */
    function update(dt, elapsedTime) {
      const b = bounds;
      const t = elapsedTime;

      for (let i = 0; i < PETAL_COUNT; i++) {
        const p = petals[i];

        // Downward motion
        p.y -= p.fallSpeed * dt;

        // Recycle petal when it falls past the bottom
        if (p.y < b.bottom) {
          p.y = b.top + Math.random() * 10;
          p.baseX = (Math.random() - 0.5) * b.halfWidth * 2;
          p.z = -12 + Math.random() * 32;
          p.fallSpeed = 10.5 + Math.random() * 11.0;
        }

        // Horizontal floating breeze motion
        const swayX = Math.sin(t * p.driftFreqX + p.driftPhaseX) * p.driftAmpX;
        const subSway = Math.cos(t * 0.4 + p.driftPhaseX) * 1.8;
        p.mesh.position.x = p.baseX + swayX + subSway;
        p.mesh.position.y = p.y;
        p.mesh.position.z = p.z;

        // Realistic 3D tumbling
        p.mesh.rotation.x += p.rotSpeedX * dt;
        p.mesh.rotation.y += p.rotSpeedY * dt;
        p.mesh.rotation.z = Math.sin(t * p.rotSpeedZ + p.rotPhase) * 0.6;
      }
    }

    /**
     * Handle camera or screen resize
     */
    function handleResize() {
      bounds = getBounds();
    }

    return {
      group: group,
      update: update,
      handleResize: handleResize
    };
  }

  // Export to window
  if (typeof window !== 'undefined') {
    window.createRosePetals = createRosePetals;
  }
})();
