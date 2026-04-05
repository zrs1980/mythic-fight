// Generates all game textures programmatically using Phaser's Graphics API

export class TextureManager {

  /** Generate all textures needed for the game */
  static createAll(scene) {
    TextureManager._createPlayerTextures(scene);
    TextureManager._createEnemyTextures(scene);
    TextureManager._createBossTextures(scene);
    TextureManager._createProjectileTextures(scene);
    TextureManager._createUITextures(scene);
    TextureManager._createEffectTextures(scene);
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────

  static _gfx(scene) {
    return scene.add.graphics();
  }

  static _gen(scene, g, key, w, h) {
    g.generateTexture(key, w, h);
    g.destroy();
  }

  /** Draw a star shape using fillPoints (Phaser.Geom.Star equivalent via manual points) */
  static _drawStar(g, cx, cy, points, outerR, innerR) {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    g.fillPoints(pts, true);
  }

  // Draw a simple griffin body on a graphics object
  // cx/cy = center, w/h = sprite dimensions, primaryColor, secondaryColor, facing (-1 left, 1 right)
  static _drawGriffin(g, cx, cy, w, h, primaryColor, secondaryColor, wingColor, frame) {
    const bodyW = Math.floor(w * 0.38);
    const bodyH = Math.floor(h * 0.38);
    const headR = Math.floor(w * 0.20);

    // Shadow
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(cx, cy + h * 0.45, bodyW * 2.2, 10);

    // Tail
    g.fillStyle(secondaryColor, 1);
    g.fillTriangle(
      cx - bodyW * 1.05, cy + bodyH * 0.1,
      cx - bodyW * 1.6, cy - bodyH * 0.4,
      cx - bodyW * 1.6, cy + bodyH * 0.5
    );

    // Wings (behind body)
    g.fillStyle(wingColor, 1);
    // Wing feathers upper
    for (let i = 0; i < 5; i++) {
      const wx = cx - bodyW * 0.3 + i * bodyW * 0.15;
      const wy = cy - bodyH * 0.9 - i * 4;
      g.fillTriangle(wx, wy, wx - 8, wy + 22, wx + 8, wy + 22);
    }
    // Wing span
    g.fillEllipse(cx, cy - bodyH * 0.5, bodyW * 2.8, bodyH * 1.1);

    // Body (lion)
    g.fillStyle(primaryColor, 1);
    g.fillEllipse(cx, cy + bodyH * 0.15, bodyW * 2, bodyH * 2);

    // Front legs
    const legOffset = frame === 'walk1' ? 6 : (frame === 'walk2' ? -4 : 0);
    g.fillStyle(primaryColor, 1);
    g.fillRect(cx - bodyW * 0.7, cy + bodyH * 0.7, 10, 20 + legOffset);
    g.fillRect(cx + bodyW * 0.3, cy + bodyH * 0.7, 10, 20 - legOffset);

    // Claws front left
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(
      cx - bodyW * 0.7 + 2, cy + bodyH * 0.7 + 20 + legOffset,
      cx - bodyW * 0.7 - 5, cy + bodyH * 0.7 + 28 + legOffset,
      cx - bodyW * 0.7 + 4, cy + bodyH * 0.7 + 28 + legOffset
    );
    // Claws front right
    g.fillTriangle(
      cx + bodyW * 0.3 + 2, cy + bodyH * 0.7 + 20 - legOffset,
      cx + bodyW * 0.3 - 5, cy + bodyH * 0.7 + 28 - legOffset,
      cx + bodyW * 0.3 + 4, cy + bodyH * 0.7 + 28 - legOffset
    );

    // Beak / Eagle head
    g.fillStyle(primaryColor, 1);
    g.fillCircle(cx + bodyW * 0.65, cy - bodyH * 0.3, headR);

    // Beak
    g.fillStyle(0xffcc00, 1);
    g.fillTriangle(
      cx + bodyW * 0.65 + headR - 2, cy - bodyH * 0.3,
      cx + bodyW * 0.65 + headR + 12, cy - bodyH * 0.3 + 4,
      cx + bodyW * 0.65 + headR - 2, cy - bodyH * 0.3 + 8
    );

    // Eye
    g.fillStyle(0x222222, 1);
    g.fillCircle(cx + bodyW * 0.65 + headR * 0.35, cy - bodyH * 0.38, 3);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + bodyW * 0.65 + headR * 0.35 + 1, cy - bodyH * 0.38 - 1, 1);

    // Eagle tuft / feather crown
    g.fillStyle(secondaryColor, 1);
    g.fillTriangle(
      cx + bodyW * 0.55, cy - bodyH * 0.3 - headR,
      cx + bodyW * 0.45, cy - bodyH * 0.3 - headR - 10,
      cx + bodyW * 0.65, cy - bodyH * 0.3 - headR - 8
    );

    // Attack frame: extend claw
    if (frame === 'attack') {
      g.fillStyle(0xffffff, 1);
      g.fillRect(cx + bodyW * 0.9, cy + bodyH * 0.1, 22, 5);
      g.fillTriangle(
        cx + bodyW * 0.9 + 22, cy + bodyH * 0.1 - 3,
        cx + bodyW * 0.9 + 34, cy + bodyH * 0.1 + 2,
        cx + bodyW * 0.9 + 22, cy + bodyH * 0.1 + 8
      );
    }

    // Hurt frame: slight color shift indicator
    if (frame === 'hurt') {
      g.fillStyle(0xff4444, 0.35);
      g.fillEllipse(cx, cy, bodyW * 2.2, bodyH * 2.4);
    }
  }

  static _createPlayerTextures(scene) {
    const W = 48, H = 64;
    const cx = W * 0.5, cy = H * 0.45;
    const frames = ['idle', 'walk1', 'walk2', 'attack', 'hurt'];

    // Player 1 (Lily - gold)
    frames.forEach(frame => {
      const g = TextureManager._gfx(scene);
      TextureManager._drawGriffin(g, cx, cy, W, H, 0xf5c842, 0x8b4513, 0xd4a017, frame);
      TextureManager._gen(scene, g, `lily_${frame}`, W, H);
    });

    // Player 2 (Rose - silver/blue)
    frames.forEach(frame => {
      const g = TextureManager._gfx(scene);
      TextureManager._drawGriffin(g, cx, cy, W, H, 0xc0c0c0, 0x6699cc, 0xa0b8d8, frame);
      TextureManager._gen(scene, g, `rose_${frame}`, W, H);
    });
  }

  // Draw a Royal Guard enemy
  static _drawGuard(g, cx, cy, w, h, frame, isBoss) {
    const scale = isBoss ? 1.2 : 1.0;
    const bw = Math.floor(w * 0.4 * scale);
    const bh = Math.floor(h * 0.35 * scale);

    // Shadow
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(cx, cy + h * 0.44, bw * 2.2, 10);

    // Legs
    const legOff = frame === 'walk1' ? 7 : (frame === 'walk2' ? -5 : 0);
    g.fillStyle(0xcc1111, 1);
    g.fillRect(cx - bw * 0.6, cy + bh * 0.75, 11, 22 + legOff);
    g.fillRect(cx + bw * 0.1, cy + bh * 0.75, 11, 22 - legOff);

    // Boots
    g.fillStyle(0x222222, 1);
    g.fillRect(cx - bw * 0.6 - 2, cy + bh * 0.75 + 20 + legOff, 15, 7);
    g.fillRect(cx + bw * 0.1 - 2, cy + bh * 0.75 + 20 - legOff, 15, 7);

    // Body armor (red/gold)
    g.fillStyle(0xcc1111, 1);
    g.fillRect(cx - bw, cy - bh * 0.3, bw * 2, bh * 2);

    // Gold trim on armor
    g.fillStyle(0xffd700, 1);
    g.fillRect(cx - bw, cy - bh * 0.3, bw * 2, 5);
    g.fillRect(cx - bw, cy - bh * 0.3, 5, bh * 2);
    g.fillRect(cx + bw - 5, cy - bh * 0.3, 5, bh * 2);

    // Shield (if boss, bigger)
    if (isBoss) {
      g.fillStyle(0x882200, 1);
      g.fillRect(cx - bw - 18, cy - bh * 0.2, 18, 35);
      g.fillStyle(0xffd700, 1);
      g.fillCircle(cx - bw - 9, cy + 8, 5);
    }

    // Arm with sword
    g.fillStyle(0xcc1111, 1);
    const swordY = frame === 'attack' ? cy - bh * 0.1 : cy + bh * 0.2;
    g.fillRect(cx + bw - 5, cy - bh * 0.1, 10, 18);
    // Sword
    g.fillStyle(0xc0c0c0, 1);
    g.fillRect(cx + bw + 5, swordY - 20, 5, 30);
    g.fillStyle(0x8b6914, 1);
    g.fillRect(cx + bw + 2, swordY + 8, 11, 6);

    // Helmet with plume
    g.fillStyle(0x888888, 1);
    g.fillCircle(cx, cy - bh * 0.5, bw * 0.9);
    g.fillRect(cx - bw * 0.9, cy - bh * 0.5, bw * 1.8, bh * 0.6);
    // Visor slit
    g.fillStyle(0x222222, 1);
    g.fillRect(cx - bw * 0.5, cy - bh * 0.55, bw * 1.0, 5);
    // Plume
    g.fillStyle(0xff0000, 1);
    g.fillTriangle(cx, cy - bh * 0.5 - bw * 0.9 - 2, cx - 8, cy - bh * 0.5 - bw * 0.9 - (isBoss ? 22 : 16), cx + 8, cy - bh * 0.5 - bw * 0.9 - (isBoss ? 22 : 16));
    g.fillStyle(0xff6600, 1);
    g.fillTriangle(cx, cy - bh * 0.5 - bw * 0.9, cx - 5, cy - bh * 0.5 - bw * 0.9 - (isBoss ? 16 : 12), cx + 5, cy - bh * 0.5 - bw * 0.9 - (isBoss ? 16 : 12));

    if (frame === 'hurt') {
      g.fillStyle(0xff4444, 0.35);
      g.fillRect(cx - bw, cy - bh, bw * 2, bh * 2.5);
    }
  }

  // Draw an Alien enemy
  static _drawAlien(g, cx, cy, w, h, frame, isBoss) {
    const scale = isBoss ? 1.2 : 1.0;
    const hw = Math.floor(w * 0.42 * scale);
    const hh = Math.floor(h * 0.32 * scale);

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(cx, cy + h * 0.44, hw * 2, 10);

    // Thin body
    g.fillStyle(0x33aa33, 1);
    g.fillEllipse(cx, cy + hh * 0.6, hw * 0.9, hh * 2.0);

    // Tentacle arms
    g.fillStyle(0x229922, 1);
    const tentOff = frame === 'walk1' ? 8 : (frame === 'walk2' ? -6 : (frame === 'attack' ? 18 : 0));
    // Left tentacle
    g.fillEllipse(cx - hw * 0.8, cy + hh * 0.3 + tentOff * 0.5, 10, 28);
    g.fillEllipse(cx - hw * 1.3, cy + tentOff * 0.3, 9, 22);
    // Right tentacle
    g.fillEllipse(cx + hw * 0.8, cy + hh * 0.3 - tentOff * 0.5, 10, 28);
    g.fillEllipse(cx + hw * 1.3, cy - tentOff * 0.3, 9, 22);

    // Legs (thin)
    const legOff = frame === 'walk1' ? 6 : (frame === 'walk2' ? -6 : 0);
    g.fillStyle(0x229922, 1);
    g.fillRect(cx - 10, cy + hh * 0.9, 7, 20 + legOff);
    g.fillRect(cx + 3, cy + hh * 0.9, 7, 20 - legOff);

    // Big oval head (green)
    g.fillStyle(0x55cc55, 1);
    g.fillEllipse(cx, cy - hh * 0.35, hw * 2.2, hh * 2.0);

    // Crown of feelers if boss
    if (isBoss) {
      g.fillStyle(0x99ff44, 1);
      for (let i = -3; i <= 3; i++) {
        g.fillEllipse(cx + i * 12, cy - hh * 0.35 - hh * 0.85 - 8, 5, 16);
      }
    }

    // Giant black eyes
    g.fillStyle(0x000000, 1);
    g.fillEllipse(cx - hw * 0.45, cy - hh * 0.45, hw * 0.8, hh * 0.85);
    g.fillEllipse(cx + hw * 0.45, cy - hh * 0.45, hw * 0.8, hh * 0.85);
    // Eye shine
    g.fillStyle(0x444444, 0.5);
    g.fillEllipse(cx - hw * 0.52, cy - hh * 0.55, hw * 0.25, hh * 0.3);
    g.fillEllipse(cx + hw * 0.38, cy - hh * 0.55, hw * 0.25, hh * 0.3);

    // Tiny mouth
    g.fillStyle(0x117711, 1);
    g.fillRect(cx - hw * 0.2, cy - hh * 0.05, hw * 0.4, 4);

    if (frame === 'hurt') {
      g.fillStyle(0xff4444, 0.35);
      g.fillEllipse(cx, cy, hw * 2.5, hh * 3);
    }
  }

  // Draw a Victorian Rogue Settler
  static _drawSettler(g, cx, cy, w, h, frame, isBoss) {
    const scale = isBoss ? 1.15 : 1.0;
    const bw = Math.floor(w * 0.34 * scale);
    const bh = Math.floor(h * 0.32 * scale);

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(cx, cy + h * 0.44, bw * 2.2, 10);

    // Legs
    const legOff = frame === 'walk1' ? 7 : (frame === 'walk2' ? -5 : 0);
    g.fillStyle(0x3d2b1f, 1);
    g.fillRect(cx - bw * 0.6, cy + bh * 0.75, 10, 22 + legOff);
    g.fillRect(cx + bw * 0.1, cy + bh * 0.75, 10, 22 - legOff);
    // Boots
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(cx - bw * 0.6 - 2, cy + bh * 0.75 + 20 + legOff, 14, 7);
    g.fillRect(cx + bw * 0.1 - 2, cy + bh * 0.75 + 20 - legOff, 14, 7);

    // Long coat (brown)
    g.fillStyle(0x5c3d2b, 1);
    g.fillRect(cx - bw, cy - bh * 0.35, bw * 2, bh * 2.4);
    // Coat trim
    g.fillStyle(0x3d2519, 1);
    g.fillRect(cx - bw, cy - bh * 0.35, 5, bh * 2.4);
    g.fillRect(cx + bw - 5, cy - bh * 0.35, 5, bh * 2.4);

    // Arm with club
    g.fillStyle(0x5c3d2b, 1);
    g.fillRect(cx + bw - 5, cy - bh * 0.1, 10, 18);
    const clubSwing = frame === 'attack' ? -20 : 0;
    // Club
    g.fillStyle(0x6b4c2a, 1);
    g.fillRect(cx + bw + 5, cy - bh * 0.3 + clubSwing, 8, 28);
    g.fillEllipse(cx + bw + 9, cy - bh * 0.3 + clubSwing - 6, 16, 14);

    // Neck / Head
    g.fillStyle(0xd4a574, 1);
    g.fillRect(cx - 8, cy - bh * 0.7, 16, 12);
    g.fillCircle(cx, cy - bh * 0.9, bw * 0.75);

    // Eyes (sinister for boss, normal for regular)
    if (isBoss) {
      g.fillStyle(0xff0000, 1);
      g.fillCircle(cx - 8, cy - bh * 0.95, 4);
      g.fillCircle(cx + 8, cy - bh * 0.95, 4);
      // Blades from coat
      g.fillStyle(0xcccccc, 1);
      g.fillRect(cx - bw - 15, cy - bh * 0.2, 3, 30);
      g.fillRect(cx - bw - 22, cy - bh * 0.2, 3, 25);
    } else {
      g.fillStyle(0x222222, 1);
      g.fillCircle(cx - 7, cy - bh * 0.95, 3);
      g.fillCircle(cx + 7, cy - bh * 0.95, 3);
    }

    // Top hat
    g.fillStyle(0x111111, 1);
    g.fillRect(cx - bw * 0.85, cy - bh * 1.05, bw * 1.7, 6);
    g.fillRect(cx - bw * 0.65, cy - bh * 1.05 - (isBoss ? 28 : 22), bw * 1.3, (isBoss ? 28 : 22));
    // Hat band
    g.fillStyle(0x333333, 1);
    g.fillRect(cx - bw * 0.65, cy - bh * 1.05 - 7, bw * 1.3, 5);

    if (frame === 'hurt') {
      g.fillStyle(0xff4444, 0.35);
      g.fillRect(cx - bw, cy - bh * 1.2, bw * 2, bh * 3);
    }
  }

  // Draw a Flame God enemy
  static _drawFlameGod(g, cx, cy, w, h, frame, isBoss) {
    const scale = isBoss ? 1.25 : 1.0;
    const bw = Math.floor(w * 0.38 * scale);
    const bh = Math.floor(h * 0.35 * scale);

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(cx, cy + h * 0.44, bw * 2.2, 10);

    // Flame aura (behind body)
    const flameColors = [0xff6600, 0xff9900, 0xffcc00, 0xff3300];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (frame === 'walk1' ? 0.2 : 0);
      const fx = cx + Math.cos(angle) * (bw * 1.1);
      const fy = cy + Math.sin(angle) * (bh * 1.1);
      g.fillStyle(flameColors[i % 4], 0.8);
      g.fillTriangle(fx, fy, fx - 6, fy + 12, fx + 6, fy + 12);
    }

    // Legs
    const legOff = frame === 'walk1' ? 6 : (frame === 'walk2' ? -6 : 0);
    g.fillStyle(0xff4400, 1);
    g.fillRect(cx - bw * 0.55, cy + bh * 0.8, 12, 20 + legOff);
    g.fillRect(cx + bw * 0.1, cy + bh * 0.8, 12, 20 - legOff);

    // Muscular body (orange/red)
    g.fillStyle(0xff5500, 1);
    g.fillEllipse(cx, cy + bh * 0.2, bw * 2.2, bh * 2.2);
    // Muscles highlight
    g.fillStyle(0xff7722, 1);
    g.fillEllipse(cx - bw * 0.3, cy - bh * 0.1, bw * 0.65, bh * 0.65);
    g.fillEllipse(cx + bw * 0.3, cy - bh * 0.1, bw * 0.65, bh * 0.65);

    // Arms (muscular, attack extends one arm)
    g.fillStyle(0xff4400, 1);
    const armReach = frame === 'attack' ? bw * 1.6 : bw * 1.2;
    g.fillEllipse(cx - bw * 0.85, cy, bw * 0.6, bh * 0.5);
    g.fillEllipse(cx + armReach, cy, bw * 0.6, bh * 0.5);
    // Fist flames
    g.fillStyle(0xffcc00, 1);
    g.fillCircle(cx + armReach + bw * 0.25, cy, bw * 0.22);

    // Head
    g.fillStyle(0xff6622, 1);
    g.fillCircle(cx, cy - bh * 0.6, bw * 0.8);

    // Crown of flames (fire crown)
    g.fillStyle(0xffcc00, 1);
    for (let i = -2; i <= 2; i++) {
      const fx = cx + i * (bw * 0.35);
      const fh = isBoss ? 22 : 16;
      g.fillTriangle(fx, cy - bh * 0.6 - bw * 0.8, fx - 6, cy - bh * 0.6 - bw * 0.8 - fh, fx + 6, cy - bh * 0.6 - bw * 0.8 - fh);
    }

    // Eyes (glowing)
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - 9, cy - bh * 0.65, 5);
    g.fillCircle(cx + 9, cy - bh * 0.65, 5);
    g.fillStyle(0xff0000, 1);
    g.fillCircle(cx - 9, cy - bh * 0.65, 3);
    g.fillCircle(cx + 9, cy - bh * 0.65, 3);

    if (frame === 'hurt') {
      g.fillStyle(0x8888ff, 0.4);
      g.fillEllipse(cx, cy, bw * 2.5, bh * 3);
    }
  }

  // Draw a Sinister Toon (creepy Mickey-like)
  static _drawToon(g, cx, cy, w, h, frame, isBoss) {
    const scale = isBoss ? 1.2 : 1.0;
    const bw = Math.floor(w * 0.34 * scale);
    const bh = Math.floor(h * 0.32 * scale);

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(cx, cy + h * 0.44, bw * 2.2, 10);

    // Yellow shoes
    const legOff = frame === 'walk1' ? 7 : (frame === 'walk2' ? -5 : 0);
    g.fillStyle(0xddcc00, 1);
    g.fillEllipse(cx - bw * 0.5, cy + bh * 0.75 + 22 + legOff, 20, 10);
    g.fillEllipse(cx + bw * 0.1 + 4, cy + bh * 0.75 + 22 - legOff, 20, 10);

    // Legs (dark)
    g.fillStyle(0x111111, 1);
    g.fillRect(cx - bw * 0.55, cy + bh * 0.75, 10, 22 + legOff);
    g.fillRect(cx + bw * 0.06, cy + bh * 0.75, 10, 22 - legOff);

    // Dark suit body
    g.fillStyle(0x111111, 1);
    g.fillRect(cx - bw, cy - bh * 0.3, bw * 2, bh * 2.2);

    // White shirt front (buttons)
    g.fillStyle(0xfafafa, 1);
    g.fillRect(cx - 6, cy - bh * 0.28, 12, bh * 2.1);
    g.fillStyle(0x111111, 1);
    for (let i = 0; i < 3; i++) {
      g.fillCircle(cx, cy - bh * 0.1 + i * 12, 2);
    }

    // White gloves (hands)
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - bw - 7, cy, bw * 0.35);
    const gloveX = frame === 'attack' ? cx + bw + 18 : cx + bw + 7;
    g.fillCircle(gloveX, cy, bw * 0.35);

    // Neck
    g.fillStyle(0xfafafa, 1);
    g.fillRect(cx - 8, cy - bh * 0.7, 16, 12);

    // Pale white creepy face
    g.fillStyle(0xf0f0ee, 1);
    g.fillCircle(cx, cy - bh * 0.9, bw * 0.9);

    // HUGE CREEPY GRIN with sharp teeth
    const mouthY = cy - bh * 0.82;
    g.fillStyle(0x111111, 1);
    // Mouth opening (wide)
    g.fillEllipse(cx, mouthY, bw * 1.3, bh * 0.55);
    // Sharp teeth (white triangles inside mouth)
    g.fillStyle(0xffffff, 1);
    for (let i = -3; i <= 3; i++) {
      const tx = cx + i * (bw * 0.17);
      g.fillTriangle(tx, mouthY - bh * 0.18, tx - 7, mouthY + 2, tx + 7, mouthY + 2);
      g.fillTriangle(tx, mouthY + bh * 0.18, tx - 7, mouthY - 2, tx + 7, mouthY - 2);
    }
    // Red tongue
    g.fillStyle(0xcc2200, 1);
    g.fillEllipse(cx + (frame === 'attack' ? 8 : 0), mouthY + bh * 0.08, 18, 10);

    // Creepy eyes
    g.fillStyle(0xffff00, 1);
    g.fillCircle(cx - bw * 0.38, cy - bh * 1.05, 7);
    g.fillCircle(cx + bw * 0.38, cy - bh * 1.05, 7);
    g.fillStyle(0x000000, 1);
    g.fillCircle(cx - bw * 0.38, cy - bh * 1.05, 4);
    g.fillCircle(cx + bw * 0.38, cy - bh * 1.05, 4);
    // Eye shine
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - bw * 0.38 + 2, cy - bh * 1.07, 2);
    g.fillCircle(cx + bw * 0.38 + 2, cy - bh * 1.07, 2);

    // Round black mouse ears
    g.fillStyle(0x000000, 1);
    g.fillCircle(cx - bw * 0.65, cy - bh * 1.25, bw * 0.42);
    g.fillCircle(cx + bw * 0.65, cy - bh * 1.25, bw * 0.42);

    // Boss: top hat and baton
    if (isBoss) {
      g.fillStyle(0x111111, 1);
      g.fillRect(cx - bw * 0.75, cy - bh * 1.35, bw * 1.5, 6);
      g.fillRect(cx - bw * 0.55, cy - bh * 1.35 - 28, bw * 1.1, 28);
      // Hat band
      g.fillStyle(0xff0000, 1);
      g.fillRect(cx - bw * 0.55, cy - bh * 1.35 - 8, bw * 1.1, 5);
      // Baton
      g.fillStyle(0xffffff, 1);
      g.fillRect(cx + bw + 7, cy - bh * 0.5, 5, 35);
      g.fillCircle(cx + bw + 9, cy - bh * 0.5 - 5, 7);
    }

    if (frame === 'hurt') {
      g.fillStyle(0xff4444, 0.35);
      g.fillRect(cx - bw, cy - bh * 1.5, bw * 2, bh * 3.5);
    }
  }

  static _createEnemyTextures(scene) {
    const W = 48, H = 64;
    const cx = W * 0.5, cy = H * 0.45;
    const frames = ['idle', 'walk1', 'walk2', 'attack', 'hurt'];

    const drawFns = {
      guard: TextureManager._drawGuard,
      alien: TextureManager._drawAlien,
      settler: TextureManager._drawSettler,
      flame_god: TextureManager._drawFlameGod,
      toon: TextureManager._drawToon,
    };

    Object.entries(drawFns).forEach(([type, fn]) => {
      frames.forEach(frame => {
        const g = TextureManager._gfx(scene);
        fn(g, cx, cy, W, H, frame, false);
        TextureManager._gen(scene, g, `${type}_${frame}`, W, H);
      });
    });
  }

  static _createBossTextures(scene) {
    const W = 64, H = 80;
    const cx = W * 0.5, cy = H * 0.45;
    const frames = ['idle', 'walk1', 'walk2', 'attack', 'hurt'];

    const bossFns = {
      boss_guard: TextureManager._drawGuard,
      boss_alien: TextureManager._drawAlien,
      boss_settler: TextureManager._drawSettler,
      boss_flame: TextureManager._drawFlameGod,
      boss_toon: TextureManager._drawToon,
    };

    Object.entries(bossFns).forEach(([type, fn]) => {
      frames.forEach(frame => {
        const g = TextureManager._gfx(scene);
        fn(g, cx, cy, W, H, frame, true);
        TextureManager._gen(scene, g, `${type}_${frame}`, W, H);
      });
    });
  }

  static _createProjectileTextures(scene) {
    // Gold dagger (P1)
    const g1 = TextureManager._gfx(scene);
    g1.fillStyle(0xffd700, 1);
    g1.fillRect(0, 2, 14, 4);
    g1.fillTriangle(14, 0, 20, 4, 14, 8);
    g1.fillStyle(0x8b4513, 1);
    g1.fillRect(0, 3, 5, 2);
    TextureManager._gen(scene, g1, 'dagger_p1', 20, 8);

    // Purple dagger (P2)
    const g2 = TextureManager._gfx(scene);
    g2.fillStyle(0xcc88ff, 1);
    g2.fillRect(0, 2, 14, 4);
    g2.fillTriangle(14, 0, 20, 4, 14, 8);
    g2.fillStyle(0x334477, 1);
    g2.fillRect(0, 3, 5, 2);
    TextureManager._gen(scene, g2, 'dagger_p2', 20, 8);
  }

  static _createUITextures(scene) {
    // Health bar backgrounds
    const bg = TextureManager._gfx(scene);
    bg.fillStyle(0x222222, 1);
    bg.fillRoundedRect(0, 0, 190, 18, 5);
    TextureManager._gen(scene, bg, 'hud_bar_bg', 190, 18);

    // Sparkle particle
    const sp = TextureManager._gfx(scene);
    sp.fillStyle(0xffffff, 1);
    TextureManager._drawStar(sp, 8, 8, 5, 6, 2);
    TextureManager._gen(scene, sp, 'sparkle', 16, 16);

    // Floor tile (subtle)
    const ft = TextureManager._gfx(scene);
    ft.fillStyle(0x555566, 1);
    ft.fillRect(0, 0, 64, 24);
    ft.fillStyle(0x444455, 1);
    ft.fillRect(0, 0, 32, 12);
    ft.fillRect(32, 12, 32, 12);
    ft.lineStyle(1, 0x333344, 0.5);
    ft.strokeRect(0, 0, 64, 24);
    TextureManager._gen(scene, ft, 'floor_tile', 64, 24);
  }

  static _createEffectTextures(scene) {
    // White flash overlay (used for hurt effects)
    const flash = TextureManager._gfx(scene);
    flash.fillStyle(0xffffff, 1);
    flash.fillRect(0, 0, 48, 64);
    TextureManager._gen(scene, flash, 'flash_overlay', 48, 64);

    // Star burst effect
    const colors = [0xffff00, 0xff8800, 0xff44ff, 0x44ffff, 0x00ff88];
    colors.forEach((color, i) => {
      const g = TextureManager._gfx(scene);
      g.fillStyle(color, 1);
      TextureManager._drawStar(g, 8, 8, 5, 8, 3);
      TextureManager._gen(scene, g, `star_${i}`, 16, 16);
    });
  }
}
