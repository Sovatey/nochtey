/**
 * heart.js - 3D Parametric Heart Ribbon Particle Component
 */

// Parametric Heart Calculation & Normal Vectors
function getHeartPointAndNormal(t, scale = CONFIG.HEART_SCALE) {
  const sinT = Math.sin(t);
  const cosT = Math.cos(t);

  const x = 16 * Math.pow(sinT, 3);
  const y = 13 * cosT - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

  const dxdt = 48 * Math.pow(sinT, 2) * cosT;
  const dydt = -13 * sinT + 10 * Math.sin(2 * t) + 6 * Math.sin(3 * t) + 4 * Math.sin(4 * t);

  const len = Math.hypot(dxdt, dydt) || 1.0;
  const nx = -dydt / len;
  const ny = dxdt / len;

  return {
    point: new THREE.Vector3(x * scale, y * scale, 0),
    normal: new THREE.Vector2(nx, ny)
  };
}

function gaussianRandom(mean = 0, stdev = 1) {
  const u1 = Math.max(Math.random(), 1e-10);
  const u2 = Math.max(Math.random(), 1e-10);
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdev + mean;
}

// Shaders for Romantic Rose & Ruby Particles on White
const heartVertexShader = `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  attribute float aCurveProgress;

  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uPointScale;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlint;

  void main() {
    vColor = aColor;

    float bandWidth = 0.25;
    float sweepFactor = smoothstep(aCurveProgress - bandWidth, aCurveProgress, uProgress * (1.0 + bandWidth));
    float stagger = sin(aPhase * 3.0) * 0.03;
    float p = clamp(sweepFactor + stagger, 0.0, 1.0);
    float easedProgress = p * p * (3.0 - 2.0 * p);

    vec3 pos = position;

    if (easedProgress > 0.25) {
      // Slow, tranquil 3D floating drift on individual dots (no overall heart pop)
      float swayX = sin(uTime * 0.52 + aPhase * 4.2) * 1.2;
      float swayY = cos(uTime * 0.44 + aPhase * 3.7) * 1.0;
      float swayZ = sin(uTime * 0.50 + aPhase * 5.1) * 1.4;

      // Gentle, slow harmonic wave traveling across the ribbon dots
      float ribbonWave = sin(uTime * 0.58 + aCurveProgress * 12.56 + aPhase * 2.0) * 0.75;

      pos += vec3(swayX, swayY + ribbonWave, swayZ) * easedProgress;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Slow, serene dot breathing in size (gentle shimmer)
    float sparkle = sin(uTime * 0.85 + aPhase * 6.28);
    float sizePulse = 1.0 + 0.18 * sparkle;
    gl_PointSize = aSize * sizePulse * uPixelRatio * (uPointScale / -mvPosition.z) * easedProgress;

    // Slow, soft twinkle and diamond glint
    vAlpha = easedProgress * (0.84 + 0.16 * sin(uTime * 0.65 + aPhase * 3.14));
    vGlint = pow(max(0.0, sin(uTime * 0.90 + aPhase * 6.28)), 5.0);
  }
`;

const heartFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vGlint;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float r = length(coord);

    if (r > 0.5) discard;

    // Silk-smooth radial falloff for luxury print quality on ivory parchment
    float shape = smoothstep(0.5, 0.06, r);
    float core = smoothstep(0.20, 0.0, r);

    // Warm champagne ivory shimmer with starlight glint
    vec3 glintColor = vec3(1.0, 0.95, 0.88);
    vec3 finalColor = mix(vColor, glintColor, core * (0.36 + vGlint * 0.45));
    float alpha = shape * vAlpha * (0.85 + vGlint * 0.15);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * Creates and initializes the 3D Heart Ribbon Particle System
 */
function createHeartSystem(renderer, initialDistance) {
  const count = CONFIG.PARTICLE_COUNT;
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const curveProgresses = new Float32Array(count);

  // Royal Velvet Burgundy, Warm Carmine, Antique Blush & Gold Leaf Palette
  // Directly calibrated to the corner bouquet roses and parchment card
  const colorDeepBurgundy  = new THREE.Color('#540518'); // Velvet Rose Shadow
  const colorVelvetWine    = new THREE.Color('#740a20'); // Deep Antique Burgundy
  const colorRoyalCrimson  = new THREE.Color('#94132e'); // Rich Crimson Core
  const colorCarmineRose   = new THREE.Color('#b51d3b'); // Warm Carmine Rose
  const colorWarmRose      = new THREE.Color('#cf3857'); // Romantic Petal Rose
  const colorBlushRose     = new THREE.Color('#e87d92'); // Soft Blush Rose
  const colorChampagneRose = new THREE.Color('#f4b2be'); // Warm Antique Blush
  const colorGildedGold    = new THREE.Color('#d4a259'); // Royal Gold Dust Glint

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = (Math.random() - 0.5) * Math.PI * 2;
    const { point, normal } = getHeartPointAndNormal(t, CONFIG.HEART_SCALE);

    const layer = Math.random();
    let normalOffset, tangOffset, zOffset;

    if (layer < 0.78) {
      normalOffset = gaussianRandom(0, 2.6);
      tangOffset = gaussianRandom(0, 1.4);
      zOffset = gaussianRandom(0, 3.8);
    } else {
      normalOffset = gaussianRandom(0, 4.4);
      tangOffset = gaussianRandom(0, 2.0);
      zOffset = gaussianRandom(0, 5.2);
    }

    // Trim only the small amount of extreme stray dots that scatter too far outside or inside
    normalOffset = Math.max(-5.0, Math.min(5.0, normalOffset));

    if (point.y < -48) {
      zOffset *= 0.7;
      normalOffset *= 0.85;
    }

    positions[i3] = point.x + normal.x * normalOffset - normal.y * tangOffset;
    positions[i3 + 1] = point.y + normal.y * normalOffset + normal.x * tangOffset;
    positions[i3 + 2] = point.z + zOffset;

    const maxHeartX = 16.0 * CONFIG.HEART_SCALE;
    const normalizedX = (point.x / maxHeartX + 1.0) * 0.5;
    curveProgresses[i] = Math.max(0.0, Math.min(1.0, normalizedX));

    let baseCol;
    const distFromCenter = Math.abs(normalOffset);
    const randCol = Math.random();

    // Occasional delicate gold dust shimmer (4%)
    if (randCol < 0.04) {
      baseCol = colorGildedGold;
    } else if (distFromCenter < 2.2 && randCol < 0.28) {
      baseCol = colorDeepBurgundy;
    } else if (randCol < 0.46) {
      baseCol = colorVelvetWine;
    } else if (randCol < 0.68) {
      baseCol = colorRoyalCrimson;
    } else if (randCol < 0.84) {
      baseCol = colorCarmineRose;
    } else if (randCol < 0.93) {
      baseCol = colorWarmRose;
    } else if (randCol < 0.98) {
      baseCol = colorBlushRose;
    } else {
      baseCol = colorChampagneRose;
    }

    const variation = 0.96 + Math.random() * 0.08;
    colors[i3] = Math.min(1.0, baseCol.r * variation);
    colors[i3 + 1] = Math.min(1.0, baseCol.g * variation);
    colors[i3 + 2] = Math.min(1.0, baseCol.b * variation);

    sizes[i] = 1.6 + Math.pow(Math.random(), 2.0) * 4.8;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aCurveProgress', new THREE.BufferAttribute(curveProgresses, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: heartVertexShader,
    fragmentShader: heartFragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uProgress: { value: 0.0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uPointScale: { value: 280.0 * (initialDistance / CONFIG.BASE_DESKTOP_DISTANCE) }
    },
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
    depthTest: true
  });

  const mesh = new THREE.Points(geometry, material);

  return {
    mesh,
    material,
    geometry,
    update(elapsedTime, progress) {
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uProgress.value = progress;
    },
    updateScale(pointScale, pixelRatio) {
      material.uniforms.uPointScale.value = pointScale;
      material.uniforms.uPixelRatio.value = pixelRatio;
    }
  };
}

if (typeof window !== 'undefined') {
  window.createHeartSystem = createHeartSystem;
}
