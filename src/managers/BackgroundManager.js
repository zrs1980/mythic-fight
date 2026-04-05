// Generates layered backgrounds for each level programmatically
// Avoids per-tile loops across worldWidth — uses solid fills + a few accents

import { GAME_HEIGHT, GAME_WIDTH, FLOOR_MIN_Y } from '../config/constants.js';

export class BackgroundManager {

  /** Create the background for a given level; returns array of GameObjects */
  static createBackground(scene, levelId, worldWidth) {
    switch (levelId) {
      case 1: return BackgroundManager._castleBackground(scene, worldWidth);
      case 2: return BackgroundManager._alienBackground(scene, worldWidth);
      case 3: return BackgroundManager._victorianBackground(scene, worldWidth);
      case 4: return BackgroundManager._sunBackground(scene, worldWidth);
      case 5: return BackgroundManager._darkKingdomBackground(scene, worldWidth);
      default: return BackgroundManager._castleBackground(scene, worldWidth);
    }
  }

  // ── LEVEL 1: Castle of Shadows ───────────────────────────────────────────

  static _castleBackground(scene, worldWidth) {
    const objects = [];

    // Sky (fixed — scrollFactor 0 so it never tiles out)
    const sky = scene.add.graphics().setScrollFactor(0);
    sky.fillStyle(0x1a1a3e, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    objects.push(sky);

    // Distant stars (fixed on sky)
    const stars = scene.add.graphics().setScrollFactor(0);
    const starPositions = [
      [0.08,0.05],[0.18,0.12],[0.28,0.07],[0.38,0.18],[0.48,0.04],
      [0.58,0.14],[0.68,0.08],[0.78,0.16],[0.88,0.06],[0.95,0.20],
      [0.12,0.22],[0.33,0.28],[0.52,0.25],[0.73,0.23],[0.91,0.30],
    ];
    starPositions.forEach(([sx, sy]) => {
      stars.fillStyle(0xffffff, 0.7);
      stars.fillCircle(sx * GAME_WIDTH, sy * FLOOR_MIN_Y, 1.5);
    });
    objects.push(stars);

    // Castle silhouette (slow parallax, drawn once at fixed screen coords)
    const castle = scene.add.graphics().setScrollFactor(0.15);
    castle.fillStyle(0x111128, 1);
    castle.fillRect(100, 90, 780, 230);
    // Towers
    [[80, 50, 85, 100],[260, 30, 75, 110],[470, 15, 80, 115],[680, 35, 78, 105],[860, 55, 85, 95]].forEach(([x, y, w, h]) => {
      castle.fillRect(x, y, w, h);
    });
    // Battlements (just 12, not looped across worldWidth)
    for (let i = 0; i < 14; i++) {
      castle.fillRect(100 + i * 57, 85, 24, 22);
    }
    // Glowing windows
    castle.fillStyle(0xffaa33, 0.55);
    [200, 330, 460, 590, 720].forEach(wx => {
      castle.fillRect(wx, 150, 22, 30);
    });
    objects.push(castle);

    // Stone wall mid-section (solid colour, spans world width — single fillRect)
    const wall = scene.add.graphics().setScrollFactor(0.55);
    wall.fillStyle(0x3a3a4a, 1);
    wall.fillRect(0, FLOOR_MIN_Y - 150, worldWidth, 150);
    // Horizontal mortar lines (just 4 lines — not a tile grid)
    wall.lineStyle(1, 0x282838, 0.7);
    [1, 2, 3, 4].forEach(i => {
      wall.lineBetween(0, FLOOR_MIN_Y - 150 + i * 30, worldWidth, FLOOR_MIN_Y - 150 + i * 30);
    });
    objects.push(wall);

    // Torches — only 6, spread across visible portion (not full worldWidth loop)
    [280, 700, 1120, 1540, 1960, 2380].forEach(tx => {
      const torch = scene.add.graphics().setScrollFactor(0.6);
      torch.fillStyle(0x5c3d1e, 1);
      torch.fillRect(tx, FLOOR_MIN_Y - 65, 8, 48);
      torch.fillRect(tx - 5, FLOOR_MIN_Y - 70, 18, 10);
      torch.fillStyle(0xff6600, 0.9);
      torch.fillTriangle(tx + 4, FLOOR_MIN_Y - 98, tx - 4, FLOOR_MIN_Y - 70, tx + 12, FLOOR_MIN_Y - 70);
      torch.fillStyle(0xffcc00, 0.85);
      torch.fillTriangle(tx + 4, FLOOR_MIN_Y - 88, tx, FLOOR_MIN_Y - 70, tx + 8, FLOOR_MIN_Y - 70);
      torch.fillStyle(0xff8800, 0.12);
      torch.fillCircle(tx + 4, FLOOR_MIN_Y - 82, 28);
      objects.push(torch);
    });

    // Banners — only 4
    [380, 900, 1420, 1940].forEach(bx => {
      const banner = scene.add.graphics().setScrollFactor(0.6);
      banner.fillStyle(0x880000, 1);
      banner.fillRect(bx, FLOOR_MIN_Y - 128, 40, 68);
      banner.fillStyle(0xffd700, 1);
      banner.fillTriangle(bx + 20, FLOOR_MIN_Y - 58, bx + 5, FLOOR_MIN_Y - 44, bx + 35, FLOOR_MIN_Y - 44);
      banner.lineStyle(2, 0xffd700, 1);
      banner.strokeRect(bx, FLOOR_MIN_Y - 128, 40, 68);
      objects.push(banner);
    });

    // Floor (solid, full world width — one draw call)
    const floor = scene.add.graphics();
    floor.fillStyle(0x555566, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    // Two floor accent lines
    floor.lineStyle(2, 0x444455, 0.8);
    floor.lineBetween(0, FLOOR_MIN_Y + 8, worldWidth, FLOOR_MIN_Y + 8);
    floor.lineStyle(1, 0x444455, 0.4);
    floor.lineBetween(0, FLOOR_MIN_Y + 20, worldWidth, FLOOR_MIN_Y + 20);
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 2: Planet Xharkon ──────────────────────────────────────────────

  static _alienBackground(scene, worldWidth) {
    const objects = [];

    // Space sky (fixed)
    const sky = scene.add.graphics().setScrollFactor(0);
    sky.fillStyle(0x000010, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    objects.push(sky);

    // Stars (fixed, many small dots)
    const stars = scene.add.graphics().setScrollFactor(0);
    const alienStars = [
      [0.05,0.08],[0.12,0.03],[0.20,0.15],[0.28,0.06],[0.36,0.18],
      [0.44,0.10],[0.52,0.04],[0.60,0.20],[0.68,0.12],[0.76,0.05],
      [0.84,0.17],[0.92,0.09],[0.10,0.28],[0.30,0.32],[0.50,0.26],
      [0.70,0.30],[0.88,0.24],[0.03,0.35],[0.40,0.40],[0.62,0.38],
      [0.80,0.42],[0.95,0.35],[0.22,0.45],[0.55,0.48],[0.75,0.50],
    ];
    alienStars.forEach(([sx, sy]) => {
      const alpha = 0.4 + Math.random() * 0.6;
      stars.fillStyle(0xffffff, alpha);
      stars.fillCircle(sx * GAME_WIDTH, sy * FLOOR_MIN_Y, Math.random() * 1.5 + 0.3);
    });
    objects.push(stars);

    // Large PINK/PURPLE/BLACK moon (fixed left side)
    const moon = scene.add.graphics().setScrollFactor(0);
    moon.fillStyle(0x880044, 0.18);
    moon.fillCircle(155, 160, 125);
    moon.fillStyle(0x9944aa, 1);
    moon.fillCircle(155, 160, 108);
    moon.fillStyle(0xcc55bb, 1);
    moon.fillCircle(130, 138, 84);
    moon.fillStyle(0xee77cc, 1);
    moon.fillCircle(120, 126, 62);
    // Black/dark craters
    moon.fillStyle(0x220033, 0.75);
    moon.fillCircle(118, 122, 20);
    moon.fillCircle(168, 155, 14);
    moon.fillCircle(140, 178, 17);
    moon.fillCircle(175, 120, 9);
    objects.push(moon);

    // Nebula wisps (fixed)
    const nebula = scene.add.graphics().setScrollFactor(0);
    nebula.fillStyle(0x330066, 0.28);
    nebula.fillEllipse(640, 110, 420, 150);
    nebula.fillStyle(0x004433, 0.22);
    nebula.fillEllipse(800, 75, 320, 120);
    objects.push(nebula);

    // Alien mid-ground (solid colour, world width)
    const midground = scene.add.graphics().setScrollFactor(0.45);
    midground.fillStyle(0x2d1f4a, 1);
    midground.fillRect(0, FLOOR_MIN_Y - 120, worldWidth, 120);
    // Bioluminescent horizontal glow strip
    midground.fillStyle(0x00ff88, 0.12);
    midground.fillRect(0, FLOOR_MIN_Y - 10, worldWidth, 10);
    objects.push(midground);

    // Alien rock formations — only 5 at fixed world positions
    [300, 750, 1200, 1650, 2100].forEach(rx => {
      const rock = scene.add.graphics().setScrollFactor(0.5);
      rock.fillStyle(0x3d2f5a, 1);
      rock.fillTriangle(rx, FLOOR_MIN_Y, rx - 48, FLOOR_MIN_Y, rx - 18, FLOOR_MIN_Y - 90);
      rock.fillTriangle(rx + 28, FLOOR_MIN_Y, rx - 18, FLOOR_MIN_Y, rx + 8, FLOOR_MIN_Y - 65);
      rock.fillStyle(0x00ff88, 0.3);
      rock.fillCircle(rx - 18, FLOOR_MIN_Y - 55, 12);
      objects.push(rock);
    });

    // Floor (alien surface)
    const floor = scene.add.graphics();
    floor.fillStyle(0x3d2f5a, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    floor.lineStyle(1, 0x00ff88, 0.35);
    floor.lineBetween(0, FLOOR_MIN_Y + 5, worldWidth, FLOOR_MIN_Y + 5);
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 3: Fog of London ───────────────────────────────────────────────

  static _victorianBackground(scene, worldWidth) {
    const objects = [];

    // Grey foggy sky (fixed)
    const sky = scene.add.graphics().setScrollFactor(0);
    sky.fillStyle(0x808090, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    objects.push(sky);

    // Fog layer (fixed)
    const fog = scene.add.graphics().setScrollFactor(0);
    fog.fillStyle(0xc8c8d0, 0.35);
    fog.fillRect(0, 0, GAME_WIDTH, FLOOR_MIN_Y * 0.9);
    fog.fillStyle(0xd8d8e0, 0.2);
    fog.fillRect(0, FLOOR_MIN_Y * 0.4, GAME_WIDTH, FLOOR_MIN_Y * 0.5);
    objects.push(fog);

    // Victorian building silhouettes (fixed, slow scroll)
    const buildings = scene.add.graphics().setScrollFactor(0.18);
    buildings.fillStyle(0x404048, 1);
    [[0, 185, 145],[155, 152, 118],[282, 205, 175],[468, 142, 98],
     [576, 172, 158],[744, 132, 108],[862, 195, 140],[1012, 158, 128]].forEach(([bx, bh, bw]) => {
      buildings.fillRect(bx, FLOOR_MIN_Y - bh, bw, bh);
      buildings.fillTriangle(bx, FLOOR_MIN_Y - bh, bx + bw * 0.5, FLOOR_MIN_Y - bh - 38, bx + bw, FLOOR_MIN_Y - bh);
      // Chimney
      buildings.fillRect(bx + bw * 0.6, FLOOR_MIN_Y - bh - 28, 14, 34);
      // Just 2 windows per building, not nested loops
      buildings.fillStyle(0xffff88, 0.55);
      buildings.fillRect(bx + 15, FLOOR_MIN_Y - bh + 25, 14, 18);
      buildings.fillRect(bx + bw * 0.55, FLOOR_MIN_Y - bh + 25, 14, 18);
      buildings.fillStyle(0x404048, 1);
    });
    objects.push(buildings);

    // Gas lamps — only 5 across visible area
    [180, 460, 740, 1020, 1300].forEach(lx => {
      const lamp = scene.add.graphics().setScrollFactor(0.55);
      lamp.fillStyle(0x333344, 1);
      lamp.fillRect(lx, FLOOR_MIN_Y - 118, 6, 118);
      lamp.fillRect(lx - 20, FLOOR_MIN_Y - 118, 26, 6);
      lamp.fillStyle(0x555566, 1);
      lamp.fillRect(lx - 28, FLOOR_MIN_Y - 140, 20, 24);
      lamp.fillStyle(0xffee88, 0.9);
      lamp.fillRect(lx - 26, FLOOR_MIN_Y - 138, 16, 20);
      lamp.fillStyle(0xffee88, 0.08);
      lamp.fillCircle(lx - 18, FLOOR_MIN_Y - 128, 48);
      objects.push(lamp);
    });

    // Wall mid-section (solid)
    const wall = scene.add.graphics().setScrollFactor(0.55);
    wall.fillStyle(0x5a5a62, 1);
    wall.fillRect(0, FLOOR_MIN_Y - 95, worldWidth, 95);
    objects.push(wall);

    // Floor (solid cobblestone colour, no tiling loop)
    const floor = scene.add.graphics();
    floor.fillStyle(0x6a6a72, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    floor.lineStyle(2, 0x5a5a62, 0.7);
    floor.lineBetween(0, FLOOR_MIN_Y + 10, worldWidth, FLOOR_MIN_Y + 10);
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 4: Heart of the Sun ────────────────────────────────────────────

  static _sunBackground(scene, worldWidth) {
    const objects = [];

    // Blazing sky (fixed gradient effect via two rects)
    const sky = scene.add.graphics().setScrollFactor(0);
    sky.fillGradientStyle(0xffcc00, 0xffcc00, 0xff4400, 0xff4400, 1);
    sky.fillRect(0, 0, GAME_WIDTH, FLOOR_MIN_Y);
    objects.push(sky);

    // Solar flare streaks (fixed, just 6)
    const flares = scene.add.graphics().setScrollFactor(0);
    flares.fillStyle(0xffffff, 0.14);
    [[0, 60, 200],[150, 80, 350],[320, 50, 180],[500, 90, 280],[700, 40, 200],[820, 70, 160]].forEach(([fx, fw, fh]) => {
      flares.fillTriangle(fx, 0, fx + fw * 0.3, FLOOR_MIN_Y, fx + fw, 0);
    });
    objects.push(flares);

    // Plasma blobs mid-background
    const plasma = scene.add.graphics().setScrollFactor(0.3);
    [[80, FLOOR_MIN_Y - 55, 190, 80],[380, FLOOR_MIN_Y - 65, 150, 65],
     [680, FLOOR_MIN_Y - 50, 170, 75],[980, FLOOR_MIN_Y - 60, 160, 70]].forEach(([px, py, pw, ph]) => {
      plasma.fillStyle(0xff9900, 0.55);
      plasma.fillEllipse(px, py, pw, ph);
      plasma.fillStyle(0xffdd00, 0.4);
      plasma.fillEllipse(px + 30, py - 10, pw * 0.65, ph * 0.65);
    });
    objects.push(plasma);

    // Sun surface mid-section (solid)
    const surface = scene.add.graphics().setScrollFactor(0.5);
    surface.fillStyle(0xcc4400, 1);
    surface.fillRect(0, FLOOR_MIN_Y - 78, worldWidth, 78);
    // A few boiling bubbles (just 5, not a loop across worldWidth)
    surface.fillStyle(0xff6600, 0.7);
    [120, 360, 600, 840, 1080].forEach(bx => {
      surface.fillEllipse(bx, FLOOR_MIN_Y - 55, 110, 52);
    });
    objects.push(surface);

    // Plasma pools on floor (4 pools)
    [250, 650, 1050, 1450].forEach(px => {
      const pool = scene.add.graphics().setScrollFactor(0.8);
      pool.fillStyle(0xff6600, 0.72);
      pool.fillEllipse(px, FLOOR_MIN_Y + 28, 165, 42);
      pool.fillStyle(0xffcc00, 0.5);
      pool.fillEllipse(px + 12, FLOOR_MIN_Y + 23, 105, 26);
      objects.push(pool);
    });

    // Floor (red-hot)
    const floor = scene.add.graphics();
    floor.fillStyle(0xdd5511, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    floor.lineStyle(2, 0xff9900, 0.6);
    floor.lineBetween(0, FLOOR_MIN_Y + 6, worldWidth, FLOOR_MIN_Y + 6);
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 5: The Dark Kingdom ────────────────────────────────────────────

  static _darkKingdomBackground(scene, worldWidth) {
    const objects = [];

    // Deep dark sky (fixed)
    const sky = scene.add.graphics().setScrollFactor(0);
    sky.fillGradientStyle(0x0d0010, 0x0d0010, 0x220030, 0x220030, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    objects.push(sky);

    // Dark glitter stars (fixed, coloured)
    const stars = scene.add.graphics().setScrollFactor(0);
    const darkStars = [
      [0.06,0.04,0xff00ff],[0.14,0.14,0xffffff],[0.24,0.07,0xaa00ff],
      [0.35,0.20,0xff00ff],[0.46,0.05,0xffffff],[0.55,0.16,0x6600cc],
      [0.65,0.09,0xff00ff],[0.74,0.22,0xffffff],[0.84,0.06,0xaa00ff],
      [0.93,0.18,0xff00ff],[0.08,0.30,0x6600cc],[0.30,0.38,0xffffff],
      [0.52,0.28,0xff00ff],[0.72,0.35,0xaa00ff],[0.90,0.32,0xffffff],
    ];
    darkStars.forEach(([sx, sy, col]) => {
      stars.fillStyle(col, 0.6 + Math.random() * 0.3);
      stars.fillCircle(sx * GAME_WIDTH, sy * FLOOR_MIN_Y, Math.random() * 1.8 + 0.3);
    });
    objects.push(stars);

    // Twisted Disney castle silhouette (fixed, slow scroll)
    const castle = scene.add.graphics().setScrollFactor(0.12);
    castle.fillStyle(0x1a0025, 1);
    castle.fillRect(580, 60, 410, 262);
    castle.fillRect(558, 38, 82, 284); // tower left
    castle.fillRect(960, 48, 82, 274); // tower right
    castle.fillRect(698, 18, 72, 322); // middle tower L
    castle.fillRect(828, 28, 72, 312); // middle tower R
    // Spires
    castle.fillTriangle(558, 38, 598, 38, 578, -22);
    castle.fillTriangle(960, 48, 1000, 48, 980, -18);
    castle.fillTriangle(698, 18, 738, 18, 718, -38);
    castle.fillTriangle(828, 28, 868, 28, 848, -28);
    // Glowing red windows (just 6, not looped)
    castle.fillStyle(0x990000, 0.72);
    [620, 700, 780, 860, 920, 980].forEach(wx => {
      castle.fillRect(wx, 120, 22, 32);
    });
    objects.push(castle);

    // Floating balloons (5 at fixed positions)
    [[180, 70],[420, 110],[560, 55],[740, 90],[920, 65]].forEach(([bx, by], i) => {
      const balloon = scene.add.graphics().setScrollFactor(0.18 + i * 0.02);
      const cols = [0xff0066, 0x8800ff, 0x000088, 0x660000, 0x440044];
      balloon.fillStyle(cols[i], 0.88);
      balloon.fillEllipse(bx, by, 36, 46);
      balloon.fillStyle(cols[i], 0.55);
      balloon.fillEllipse(bx - 8, by - 10, 20, 26);
      balloon.lineStyle(1, 0x440044, 0.8);
      balloon.lineBetween(bx, by + 23, bx + 4, by + 44);
      balloon.lineBetween(bx + 4, by + 44, bx - 2, by + 64);
      objects.push(balloon);
    });

    // Dark mid-section with fence
    const mid = scene.add.graphics().setScrollFactor(0.5);
    mid.fillStyle(0x1a0025, 1);
    mid.fillRect(0, FLOOR_MIN_Y - 98, worldWidth, 98);
    // Fence spikes — just 16 visible ones, not a worldWidth loop
    mid.fillStyle(0x0d0018, 1);
    for (let fi = 0; fi < 16; fi++) {
      const fx = fi * 62;
      mid.fillRect(fx, FLOOR_MIN_Y - 88, 8, 88);
      mid.fillCircle(fx + 4, FLOOR_MIN_Y - 90, 6);
    }
    objects.push(mid);

    // Floor (dark purple)
    const floor = scene.add.graphics();
    floor.fillStyle(0x220030, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    floor.lineStyle(1, 0x8800ff, 0.3);
    floor.lineBetween(0, FLOOR_MIN_Y + 6, worldWidth, FLOOR_MIN_Y + 6);
    floor.fillStyle(0x2a0040, 0.55);
    // Just a few floor accent blocks
    [0, 200, 400, 600, 800, 1000].forEach(x => {
      floor.fillRect(x + 4, FLOOR_MIN_Y + 4, 192, 18);
    });
    objects.push(floor);

    return objects;
  }
}
