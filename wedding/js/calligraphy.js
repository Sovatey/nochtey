/**
 * calligraphy.js - 24K Hot-Stamped Gold Foil Wedding Names & Starburst Component
 */

// Pre-warm Google Fonts for Traditional Royal Khmer Moul & Taprom
if (document.fonts) {
  document.fonts.load('250px "Moul"');
  document.fonts.load('250px "Taprom"');
  document.fonts.load('250px "Kantumruy Pro"');
}

const CALLIGRAPHY_FONT = '250px "Moul", "Taprom", "Kantumruy Pro", "Khmer UI", "Leelawadee UI", cursive';

// Diamond Starburst Nodes along the strokes of ណុច and វត្តី
const nochSparkleNodes = [
  { dx: 40,  dy: -180, speed: 2.2, phase: 0.3, size: 26 }, // Top left crest of ណ
  { dx: 110, dy: -60,  speed: 2.5, phase: 1.8, size: 24 }, // Center loop of ណ
  { dx: 185, dy: 75,   speed: 2.0, phase: 3.5, size: 28 }, // Subscript vowel ុ
  { dx: 220, dy: -185, speed: 2.7, phase: 5.2, size: 25 }, // Top right arch of ណ
  { dx: 330, dy: -175, speed: 2.4, phase: 0.9, size: 26 }, // Crest of ច
  { dx: 430, dy: -40,  speed: 2.6, phase: 4.4, size: 27 }, // Loop of ច
  { dx: 465, dy: -140, speed: 2.3, phase: 2.1, size: 28 }  // Upper flourish of ច
];

const teySparkleNodes = [
  { dx: 35,  dy: -160, speed: 2.4, phase: 0.8, size: 26 }, // Left crest of វ
  { dx: 110, dy: -50,  speed: 2.6, phase: 2.5, size: 24 }, // Center loop of វ
  { dx: 145, dy: -240, speed: 2.8, phase: 4.2, size: 30 }, // Top vowel ី crown
  { dx: 165, dy: 85,   speed: 2.2, phase: 3.7, size: 28 }, // Bottom subscript ្ត
  { dx: 240, dy: -160, speed: 2.5, phase: 5.3, size: 25 }, // Right crest of ត្ត
  { dx: 275, dy: -35,  speed: 2.7, phase: 1.2, size: 26 }  // Base flourish
];

// Diamond Starburst Starflare on White Background
function drawDiamondSparkle(ctx, x, y, size, alpha, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  // Warm golden radiant halo
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.35);
  glow.addColorStop(0.0, 'rgba(230, 165, 55, 0.70)');
  glow.addColorStop(0.35, 'rgba(230, 170, 40, 0.55)');
  glow.addColorStop(1.0, 'rgba(200, 130, 20, 0.0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.35, 0, Math.PI * 2);
  ctx.fill();

  // 4-point diamond star flare in polished gold
  ctx.fillStyle = 'rgba(215, 145, 20, 0.95)';
  const rayLen = size * 1.35;
  const rayWidth = size * 0.18;

  ctx.beginPath();
  ctx.moveTo(0, -rayLen);
  ctx.quadraticCurveTo(0, 0, rayWidth, 0);
  ctx.quadraticCurveTo(0, 0, 0, rayLen);
  ctx.quadraticCurveTo(0, 0, -rayWidth, 0);
  ctx.quadraticCurveTo(0, 0, 0, -rayLen);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-rayLen, 0);
  ctx.quadraticCurveTo(0, 0, 0, rayWidth);
  ctx.quadraticCurveTo(0, 0, rayLen, 0);
  ctx.quadraticCurveTo(0, 0, -rayWidth, 0);
  ctx.quadraticCurveTo(0, 0, -rayLen, 0);
  ctx.fill();

  // White-hot champagne center glint
  ctx.fillStyle = '#fceac5';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 24K Hot-Stamped Gold Foil Word Styling on White
function draw24KGoldWord(ctx, text, x, y, size, sheenOffset) {
  ctx.font = CALLIGRAPHY_FONT;

  // 1. Crisp, subtle warm letterpress foil embossing shadow
  ctx.save();
  ctx.shadowColor = 'rgba(70, 40, 10, 0.35)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 1.8;
  ctx.shadowOffsetY = 3.5;
  ctx.fillStyle = '#7a4b04';
  ctx.fillText(text, x, y);
  ctx.restore();

  // 2. Luxurious 6-tier 24K Liquid Gold metallic gradient (Tuned for pure white contrast)
  const grad = ctx.createLinearGradient(0, y - size * 0.72, 0, y + size * 0.28);
  grad.addColorStop(0.00, '#e5b352'); // Rich warm honey gold crown (no harsh pale white)
  grad.addColorStop(0.22, '#ce9330'); // Deep polished antique gold
  grad.addColorStop(0.50, '#b5791c'); // Royal wedding warm burnished gold
  grad.addColorStop(0.78, '#945b0d'); // Deep amber gold richness
  grad.addColorStop(1.00, '#703e05'); // Warm bronze foil base shadow

  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);

  // 3. Smooth travelling specular light sheen wave (sweeps across gold foil)
  if (sheenOffset !== undefined && sheenOffset >= 0 && sheenOffset <= 1) {
    ctx.save();
    const textWidth = ctx.measureText(text).width;
    const sheenX = x + textWidth * sheenOffset;
    const sheenGrad = ctx.createLinearGradient(sheenX - 65, y, sheenX + 65, y);
    sheenGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 235, 175, 0.38)');
    sheenGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // 4. Crisp metallic edge highlight stroke
  ctx.strokeStyle = 'rgba(215, 155, 50, 0.50)';
  ctx.lineWidth = 1.4;
  ctx.strokeText(text, x, y);
}

// Glowing Golden Stardust Quill Tip while writing
function drawGoldQuillTip(ctx, x, y, alpha) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const glow = ctx.createRadialGradient(x, y, 0, x, y, 44);
  glow.addColorStop(0.0, 'rgba(255, 230, 120, 0.95)');
  glow.addColorStop(0.35, 'rgba(230, 165, 35, 0.75)');
  glow.addColorStop(0.70, 'rgba(195, 125, 20, 0.35)');
  glow.addColorStop(1.0, 'rgba(195, 125, 20, 0.0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(190, 120, 15, 0.95)';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x - 30, y); ctx.lineTo(x + 30, y);
  ctx.moveTo(x, y - 30); ctx.lineTo(x + 30, y);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(225, 160, 35, 0.85)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - 16, y - 16); ctx.lineTo(x + 16, y + 16);
  ctx.moveTo(x - 16, y + 16); ctx.lineTo(x + 16, y - 16);
  ctx.stroke();

  ctx.fillStyle = '#fff4cc';
  ctx.beginPath();
  ctx.arc(x, y, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Creates and initializes the Calligraphy Component
 */
function createCalligraphy(parentGroup) {
  const textCanvas = document.createElement('canvas');
  textCanvas.width = 2048;
  textCanvas.height = 2048;
  const textCtx = textCanvas.getContext('2d');

  const nameTexture = new THREE.CanvasTexture(textCanvas);
  nameTexture.minFilter = THREE.LinearFilter;
  nameTexture.magFilter = THREE.LinearFilter;

  const nameMaterial = new THREE.MeshBasicMaterial({
    map: nameTexture,
    transparent: true,
    depthWrite: false,
    depthTest: true
  });

  const nameGeometry = new THREE.PlaneGeometry(100, 100);
  const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial);
  nameMesh.position.set(0, -6.5, 1.2);
  parentGroup.add(nameMesh);

  function renderTextCanvas(pNoch, pTey, tipAlpha, tipX, tipY, time) {
    textCtx.clearRect(0, 0, 2048, 2048);
    textCtx.font = CALLIGRAPHY_FONT;

    // Harmonious Stepped Royal Khmer Wedding Monogram Layout
    const NAME_1 = "ណុច";
    const NAME_2 = "វត្តី";

    const nochX = 520;
    const nochY = 880;
    const nochWidth = textCtx.measureText(NAME_1).width;

    const teyX = 910;
    const teyY = 1260;
    const teyWidth = textCtx.measureText(NAME_2).width;

    const sheenCycle = (time % 3.8) / 1.5;

    // 1. Draw "ណុច"
    if (pNoch > 0) {
      textCtx.save();
      const clipW = (nochWidth + 90) * Math.min(1.0, pNoch);
      textCtx.beginPath();
      textCtx.rect(nochX - 50, nochY - 360, clipW, 520);
      textCtx.clip();

      draw24KGoldWord(textCtx, NAME_1, nochX, nochY, 250, sheenCycle);

      for (let k = 0; k < nochSparkleNodes.length; k++) {
        const sp = nochSparkleNodes[k];
        const spX = nochX + sp.dx;
        const spY = nochY + sp.dy;
        if (pNoch >= 1.0 || spX <= nochX + nochWidth * pNoch) {
          const cycle = Math.sin(time * sp.speed + sp.phase);
          const bright = Math.pow(Math.max(0, cycle), 2.4);
          if (bright > 0.04) {
            drawDiamondSparkle(textCtx, spX, spY, sp.size, bright, time * 1.6 + sp.phase);
          }
        }
      }
      textCtx.restore();
    }

    // 2. Draw "វត្តី"
    if (pTey > 0) {
      textCtx.save();
      const clipW = (teyWidth + 90) * Math.min(1.0, pTey);
      textCtx.beginPath();
      textCtx.rect(teyX - 50, teyY - 360, clipW, 520);
      textCtx.clip();

      draw24KGoldWord(textCtx, NAME_2, teyX, teyY, 250, sheenCycle);

      for (let k = 0; k < teySparkleNodes.length; k++) {
        const sp = teySparkleNodes[k];
        const spX = teyX + sp.dx;
        const spY = teyY + sp.dy;
        if (pTey >= 1.0 || spX <= teyX + teyWidth * pTey) {
          const cycle = Math.sin(time * sp.speed + sp.phase);
          const bright = Math.pow(Math.max(0, cycle), 2.4);
          if (bright > 0.04) {
            drawDiamondSparkle(textCtx, spX, spY, sp.size, bright, time * 1.6 + sp.phase);
          }
        }
      }
      textCtx.restore();
    }

    // 3. Active writing quill tip
    if (tipAlpha > 0.01) {
      drawGoldQuillTip(textCtx, tipX, tipY, tipAlpha);
    }
  }

  return {
    mesh: nameMesh,
    texture: nameTexture,
    update(elapsedTime) {
      const TL = CONFIG.TIMELINE;
      if (elapsedTime < TL.WRITE_START) return;

      const NAME_1 = "ណុច";
      const NAME_2 = "វត្តី";
      const nochX = 520;
      const nochY = 880;
      const teyX = 910;
      const teyY = 1260;

      textCtx.font = CALLIGRAPHY_FONT;
      const nochW = textCtx.measureText(NAME_1).width;
      const teyW = textCtx.measureText(NAME_2).width;

      let pNoch = 0.0;
      let pTey = 0.0;
      let tipAlpha = 0.0;
      let tipX = nochX;
      let tipY = nochY - 70;

      if (elapsedTime < TL.NOCH_END) {
        pNoch = (elapsedTime - TL.WRITE_START) / (TL.NOCH_END - TL.WRITE_START);
        tipAlpha = Math.min(1.0, pNoch * 2.5);
        tipX = nochX + nochW * pNoch;
        tipY = nochY - 70;
      } else if (elapsedTime < TL.TRANS_END) {
        pNoch = 1.0;
        const transP = (elapsedTime - TL.NOCH_END) / (TL.TRANS_END - TL.NOCH_END);
        tipAlpha = 0.85;
        tipX = (nochX + nochW) + (teyX - (nochX + nochW)) * transP;
        tipY = (nochY - 70) + (teyY - 70 - (nochY - 70)) * transP;
      } else if (elapsedTime < TL.TEY_END) {
        pNoch = 1.0;
        pTey = (elapsedTime - TL.TRANS_END) / (TL.TEY_END - TL.TRANS_END);
        tipAlpha = 1.0;
        tipX = teyX + teyW * pTey;
        tipY = teyY - 70;
      } else if (elapsedTime < TL.FLARE_END) {
        pNoch = 1.0;
        pTey = 1.0;
        tipAlpha = 1.0 - (elapsedTime - TL.TEY_END) / (TL.FLARE_END - TL.TEY_END);
        tipX = teyX + teyW;
        tipY = teyY - 70;
      } else {
        pNoch = 1.0;
        pTey = 1.0;
        tipAlpha = 0.0;
      }

      renderTextCanvas(pNoch, pTey, tipAlpha, tipX, tipY, elapsedTime);
      nameTexture.needsUpdate = true;
    }
  };
}

if (typeof window !== 'undefined') {
  window.createCalligraphy = createCalligraphy;
}
