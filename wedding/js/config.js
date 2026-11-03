/**
 * config.js - Configuration, Timelines & Responsive Viewport Helpers
 */

const CONFIG = {
  PARTICLE_COUNT: 45000,
  BASE_DESKTOP_DISTANCE: 185,
  HEART_SCALE: 4.18,

  // Animation timeline markers (in seconds)
  TIMELINE: {
    HEART_FORM_END: 2.2,
    WRITE_START: 2.4,
    NOCH_END: 3.8,
    TRANS_END: 4.1,
    TEY_END: 5.5,
    FLARE_END: 6.0,
    FLOWERS_START: 6.0, // "all flower in new backgrond load after everything load"
    FLOWERS_END: 7.8
  }
};

/**
 * Dynamically calculate camera distance based on mobile frame aspect ratio
 */
function getResponsiveCameraDistance(container) {
  const c = container || (typeof document !== 'undefined' ? document.getElementById('canvas-container') : null);
  const width = c && c.clientWidth ? c.clientWidth : window.innerWidth;
  const height = c && c.clientHeight ? c.clientHeight : window.innerHeight;
  const aspect = width / height;

  if (aspect >= 1.1) {
    return CONFIG.BASE_DESKTOP_DISTANCE;
  }
  return CONFIG.BASE_DESKTOP_DISTANCE * (1.1 / Math.max(aspect, 0.38));
}

/**
 * Helper to calculate visible viewport boundaries at current camera depth
 */
function getViewportLimits(camera) {
  const dist = camera.position.z;
  const vFov = (camera.fov * Math.PI) / 180;
  const halfH = Math.tan(vFov / 2) * dist;
  const halfW = halfH * camera.aspect;
  return {
    top: halfH + 12,
    bottom: -halfH - 12,
    screenTop: halfH,
    screenBottom: -halfH,
    width: halfW * 2.3,
    halfWidth: halfW
  };
}

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.getResponsiveCameraDistance = getResponsiveCameraDistance;
  window.getViewportLimits = getViewportLimits;
}
