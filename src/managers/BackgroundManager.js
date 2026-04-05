// Generates layered backgrounds for each level programmatically

import { GAME_HEIGHT, FLOOR_MIN_Y } from '../config/constants.js';

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

    // Sky
    const sky = scene.add.graphics();
    sky.fillStyle(0x1a1a3e, 1);
    sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
    sky.setScrollFactor(0.1);
    objects.push(sky);

    // Stars (distant)
    const stars = scene.add.graphics();
    stars.fillStyle(0xffffff, 0.6);
    for (let i = 0; i < 120; i++) {
      stars.fillCircle(Math.random() * worldWidth, Math.random() * FLOOR_MIN_Y * 0.7, Math.random() * 1.5 + 0.3);
    }
    stars.setScrollFactor(0.15);
    objects.push(stars);

    // Distant castle silhouette
    const castle = scene.add.graphics();
    castle.fillStyle(0x111128, 1);
    castle.fillRect(200, 80, 800, 220);
    castle.fillRect(180, 40, 80, 60);
    castle.fillRect(360, 20, 80, 70);
    castle.fillRect(540, 50, 80, 55);
    castle.fillRect(720, 30, 80, 65);
    castle.fillRect(900, 55, 80, 50);
    // Battlements
    for (let x = 180; x < 1000; x += 40) {
      castle.fillRect(x, 75, 22, 20);
    }
    // Windows
    castle.fillStyle(0xffaa33, 0.6);
    for (let x = 240; x < 950; x += 120) {
      castle.fillRect(x, 130, 20, 30);
    }
    castle.setScrollFactor(0.2);
    objects.push(castle);

    // Stone wall tiles (repeating)
    const wallBg = scene.add.graphics();
    wallBg.fillStyle(0x3a3a4a, 1);
    wallBg.fillRect(0, FLOOR_MIN_Y - 160, worldWidth, 160);
    // Stone tile grid
    for (let x = 0; x < worldWidth; x += 80) {
      for (let y = FLOOR_MIN_Y - 160; y < FLOOR_MIN_Y; y += 36) {
        wallBg.lineStyle(1, 0x222233, 0.8);
        wallBg.strokeRect(x + (Math.floor(y / 36) % 2 === 0 ? 0 : 40), y, 80, 36);
      }
    }
    wallBg.setScrollFactor(0.6);
    objects.push(wallBg);

    // Torches along the wall
    for (let tx = 200; tx < worldWidth; tx += 280) {
      const torch = scene.add.graphics();
      // Pole
      torch.fillStyle(0x5c3d1e, 1);
      torch.fillRect(tx, FLOOR_MIN_Y - 70, 8, 50);
      torch.fillRect(tx - 5, FLOOR_MIN_Y - 75, 18, 10);
      // Flame
      torch.fillStyle(0xff6600, 0.9);
      torch.fillTriangle(tx + 4, FLOOR_MIN_Y - 100, tx - 5, FLOOR_MIN_Y - 72, tx + 13, FLOOR_MIN_Y - 72);
      torch.fillStyle(0xffcc00, 0.9);
      torch.fillTriangle(tx + 4, FLOOR_MIN_Y - 90, tx - 1, FLOOR_MIN_Y - 72, tx + 9, FLOOR_MIN_Y - 72);
      // Glow halo
      torch.fillStyle(0xff8800, 0.15);
      torch.fillCircle(tx + 4, FLOOR_MIN_Y - 80, 30);
      torch.setScrollFactor(0.6);
      objects.push(torch);
    }

    // Banners
    for (let bx = 400; bx < worldWidth; bx += 450) {
      const banner = scene.add.graphics();
      banner.fillStyle(0x880000, 1);
      banner.fillRect(bx, FLOOR_MIN_Y - 130, 40, 70);
      banner.fillStyle(0xffd700, 1);
      banner.fillTriangle(bx + 20, FLOOR_MIN_Y - 60, bx + 5, FLOOR_MIN_Y - 45, bx + 35, FLOOR_MIN_Y - 45);
      banner.lineStyle(2, 0xffd700, 1);
      banner.strokeRect(bx, FLOOR_MIN_Y - 130, 40, 70);
      banner.setScrollFactor(0.6);
      objects.push(banner);
    }

    // Floor
    const floor = scene.add.graphics();
    floor.fillStyle(0x555566, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    // Floor tile pattern
    for (let x = 0; x < worldWidth; x += 64) {
      for (let y = FLOOR_MIN_Y; y < GAME_HEIGHT; y += 24) {
        floor.lineStyle(1, 0x444455, 0.6);
        floor.strokeRect(x + (Math.floor(y / 24) % 2 === 0 ? 0 : 32), y, 64, 24);
      }
    }
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 2: Planet Xharkon ──────────────────────────────────────────────

  static _alienBackground(scene, worldWidth) {
    const objects = [];

    // Space sky
    const sky = scene.add.graphics();
    sky.fillStyle(0x000010, 1);
    sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
    sky.setScrollFactor(0.05);
    objects.push(sky);

    // Stars (many small white dots)
    const stars = scene.add.graphics();
    for (let i = 0; i < 300; i++) {
      const brightness = Math.random();
      stars.fillStyle(0xffffff, brightness * 0.8 + 0.2);
      stars.fillCircle(Math.random() * worldWidth, Math.random() * FLOOR_MIN_Y, Math.random() * 1.8 + 0.2);
    }
    stars.setScrollFactor(0.08);
    objects.push(stars);

    // Large pink/purple/black moon on the left
    const moon = scene.add.graphics();
    // Outer glow
    moon.fillStyle(0x880044, 0.2);
    moon.fillCircle(180, 170, 130);
    // Main moon body
    moon.fillStyle(0x9944aa, 1);
    moon.fillCircle(180, 170, 110);
    moon.fillStyle(0xcc55bb, 1);
    moon.fillCircle(155, 145, 85);
    moon.fillStyle(0xee77cc, 1);
    moon.fillCircle(145, 135, 65);
    moon.fillStyle(0xbb3388, 1);
    moon.fillCircle(180, 170, 110); // overlay for craters
    // Moon craters
    moon.fillStyle(0x220033, 0.7);
    moon.fillCircle(140, 130, 22);
    moon.fillCircle(200, 160, 15);
    moon.fillCircle(160, 190, 18);
    moon.fillCircle(215, 130, 10);
    moon.setScrollFactor(0.05);
    objects.push(moon);

    // Alien nebula colors in sky
    const nebula = scene.add.graphics();
    nebula.fillStyle(0x330066, 0.3);
    nebula.fillEllipse(900, 120, 500, 180);
    nebula.fillStyle(0x004433, 0.25);
    nebula.fillEllipse(1400, 80, 400, 150);
    nebula.fillStyle(0x440055, 0.2);
    nebula.fillEllipse(2200, 100, 600, 200);
    nebula.setScrollFactor(0.12);
    objects.push(nebula);

    // Alien ground/wall mid-section
    const ground = scene.add.graphics();
    ground.fillStyle(0x2d1f4a, 1);
    ground.fillRect(0, FLOOR_MIN_Y - 130, worldWidth, 130);
    // Purple/green ground swirls
    ground.fillStyle(0x1a3a1a, 0.4);
    for (let x = 0; x < worldWidth; x += 200) {
      ground.fillEllipse(x + 100, FLOOR_MIN_Y - 40, 180, 60);
    }
    ground.setScrollFactor(0.5);
    objects.push(ground);

    // Alien rock formations
    for (let rx = 100; rx < worldWidth; rx += 350) {
      const rock = scene.add.graphics();
      const rh = 60 + Math.random() * 80;
      rock.fillStyle(0x3d2f5a, 1);
      rock.fillTriangle(rx, FLOOR_MIN_Y, rx - 50, FLOOR_MIN_Y, rx - 20, FLOOR_MIN_Y - rh);
      rock.fillTriangle(rx + 30, FLOOR_MIN_Y, rx - 20, FLOOR_MIN_Y, rx + 10, FLOOR_MIN_Y - rh * 0.7);
      // Bioluminescent glow
      rock.fillStyle(0x00ff88, 0.3);
      rock.fillCircle(rx - 20, FLOOR_MIN_Y - rh * 0.5, 15);
      rock.setScrollFactor(0.45);
      objects.push(rock);
    }

    // Floor (alien surface)
    const floor = scene.add.graphics();
    floor.fillStyle(0x3d2f5a, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    // Alien ground texture
    floor.fillStyle(0x2a1f40, 1);
    for (let x = 0; x < worldWidth; x += 80) {
      floor.fillRect(x, FLOOR_MIN_Y + 10, 70, 8);
    }
    // Glowing cracks
    floor.lineStyle(1, 0x00ff88, 0.4);
    for (let x = 0; x < worldWidth; x += 180) {
      floor.lineBetween(x, FLOOR_MIN_Y, x + 60, FLOOR_MIN_Y + 40);
      floor.lineBetween(x + 60, FLOOR_MIN_Y, x + 40, FLOOR_MIN_Y + 60);
    }
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 3: Fog of London ───────────────────────────────────────────────

  static _victorianBackground(scene, worldWidth) {
    const objects = [];

    // Grey foggy sky
    const sky = scene.add.graphics();
    sky.fillStyle(0x808090, 1);
    sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
    sky.setScrollFactor(0.05);
    objects.push(sky);

    // Fog layers
    const fog = scene.add.graphics();
    fog.fillStyle(0xc0c0c8, 0.4);
    fog.fillRect(0, 0, worldWidth, FLOOR_MIN_Y * 0.8);
    fog.fillStyle(0xd0d0d8, 0.3);
    fog.fillRect(0, FLOOR_MIN_Y * 0.3, worldWidth, FLOOR_MIN_Y * 0.5);
    fog.setScrollFactor(0.1);
    objects.push(fog);

    // Victorian building silhouettes (distant)
    const buildings = scene.add.graphics();
    buildings.fillStyle(0x404048, 1);
    const buildingData = [
      [0, 180, 150], [160, 150, 120], [290, 200, 180], [480, 140, 100],
      [590, 170, 160], [760, 130, 110], [880, 190, 140], [1030, 160, 130],
    ];
    buildingData.forEach(([bx, bh, bw]) => {
      buildings.fillRect(bx, FLOOR_MIN_Y - bh, bw, bh);
      // Peaked roof
      buildings.fillTriangle(bx, FLOOR_MIN_Y - bh, bx + bw * 0.5, FLOOR_MIN_Y - bh - 40, bx + bw, FLOOR_MIN_Y - bh);
      // Windows
      buildings.fillStyle(0xffff88, 0.6);
      for (let wy = FLOOR_MIN_Y - bh + 20; wy < FLOOR_MIN_Y - 30; wy += 35) {
        for (let wx = bx + 15; wx < bx + bw - 10; wx += 30) {
          buildings.fillRect(wx, wy, 14, 18);
        }
      }
      buildings.fillStyle(0x404048, 1);
      // Chimney
      buildings.fillRect(bx + bw * 0.6, FLOOR_MIN_Y - bh - 30, 14, 35);
    });
    buildings.setScrollFactor(0.2);
    objects.push(buildings);

    // Gas lamp posts
    for (let lx = 150; lx < worldWidth; lx += 300) {
      const lamp = scene.add.graphics();
      // Post
      lamp.fillStyle(0x333344, 1);
      lamp.fillRect(lx, FLOOR_MIN_Y - 120, 6, 120);
      // Arm
      lamp.fillRect(lx - 20, FLOOR_MIN_Y - 120, 26, 6);
      // Lantern
      lamp.fillStyle(0x555566, 1);
      lamp.fillRect(lx - 28, FLOOR_MIN_Y - 140, 20, 24);
      lamp.fillStyle(0xffee88, 0.9);
      lamp.fillRect(lx - 26, FLOOR_MIN_Y - 138, 16, 20);
      // Fog halo from lamp
      lamp.fillStyle(0xffee88, 0.1);
      lamp.fillCircle(lx - 18, FLOOR_MIN_Y - 128, 50);
      lamp.setScrollFactor(0.5);
      objects.push(lamp);
    }

    // Wall/cobblestone mid section
    const wall = scene.add.graphics();
    wall.fillStyle(0x5a5a62, 1);
    wall.fillRect(0, FLOOR_MIN_Y - 100, worldWidth, 100);
    wall.setScrollFactor(0.5);
    objects.push(wall);

    // Floor — cobblestone
    const floor = scene.add.graphics();
    floor.fillStyle(0x6a6a72, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    // Cobblestone pattern
    for (let x = 0; x < worldWidth; x += 40) {
      for (let y = FLOOR_MIN_Y; y < GAME_HEIGHT; y += 22) {
        const offset = Math.floor(y / 22) % 2 === 0 ? 0 : 20;
        floor.fillStyle(0x5c5c64, 0.8);
        floor.fillEllipse(x + offset + 20, y + 11, 38, 18);
        floor.lineStyle(1, 0x4a4a52, 0.7);
        floor.strokeEllipse(x + offset + 20, y + 11, 38, 18);
      }
    }
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 4: Heart of the Sun ────────────────────────────────────────────

  static _sunBackground(scene, worldWidth) {
    const objects = [];

    // Blazing gradient sky (orange/red/yellow)
    const sky = scene.add.graphics();
    sky.fillGradientStyle(0xffcc00, 0xffcc00, 0xff4400, 0xff4400, 1);
    sky.fillRect(0, 0, worldWidth, FLOOR_MIN_Y);
    sky.setScrollFactor(0.08);
    objects.push(sky);

    // Solar flare streaks
    const flares = scene.add.graphics();
    for (let fx = 0; fx < worldWidth; fx += 400) {
      flares.fillStyle(0xffffff, 0.15);
      flares.fillTriangle(fx, 0, fx + 60, FLOOR_MIN_Y, fx + 200, 0);
      flares.fillStyle(0xffff00, 0.12);
      flares.fillTriangle(fx + 150, 0, fx + 80, FLOOR_MIN_Y, fx + 350, 0);
    }
    flares.setScrollFactor(0.15);
    objects.push(flares);

    // Plasma blobs in mid-background
    const plasma = scene.add.graphics();
    for (let px = 100; px < worldWidth; px += 300) {
      plasma.fillStyle(0xff9900, 0.5);
      plasma.fillEllipse(px, FLOOR_MIN_Y - 50, 180, 80);
      plasma.fillStyle(0xffdd00, 0.4);
      plasma.fillEllipse(px + 40, FLOOR_MIN_Y - 60, 120, 60);
    }
    plasma.setScrollFactor(0.3);
    objects.push(plasma);

    // Sun surface texture mid-section
    const surface = scene.add.graphics();
    surface.fillStyle(0xcc4400, 1);
    surface.fillRect(0, FLOOR_MIN_Y - 80, worldWidth, 80);
    // Boiling surface bubbles
    surface.fillStyle(0xff6600, 0.7);
    for (let bx = 0; bx < worldWidth; bx += 120) {
      surface.fillEllipse(bx + 60, FLOOR_MIN_Y - 60, 100, 50);
    }
    surface.setScrollFactor(0.5);
    objects.push(surface);

    // Plasma pools on floor
    for (let px = 200; px < worldWidth; px += 500) {
      const pool = scene.add.graphics();
      pool.fillStyle(0xff6600, 0.7);
      pool.fillEllipse(px, FLOOR_MIN_Y + 30, 160, 40);
      pool.fillStyle(0xffcc00, 0.5);
      pool.fillEllipse(px + 10, FLOOR_MIN_Y + 25, 100, 25);
      pool.setScrollFactor(0.8);
      objects.push(pool);
    }

    // Floor (red hot)
    const floor = scene.add.graphics();
    floor.fillStyle(0xdd5511, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    // Glowing cracks
    floor.lineStyle(2, 0xff9900, 0.6);
    for (let x = 0; x < worldWidth; x += 200) {
      floor.lineBetween(x, FLOOR_MIN_Y, x + 80, FLOOR_MIN_Y + 50);
      floor.lineBetween(x + 80, FLOOR_MIN_Y + 50, x + 30, FLOOR_MIN_Y + 90);
    }
    floor.fillStyle(0xffaa00, 0.5);
    for (let x = 80; x < worldWidth; x += 200) {
      floor.fillEllipse(x, FLOOR_MIN_Y + 50, 60, 25);
    }
    objects.push(floor);

    return objects;
  }

  // ── LEVEL 5: The Dark Kingdom ────────────────────────────────────────────

  static _darkKingdomBackground(scene, worldWidth) {
    const objects = [];

    // Deep dark purple/black sky
    const sky = scene.add.graphics();
    sky.fillGradientStyle(0x0d0010, 0x0d0010, 0x220030, 0x220030, 1);
    sky.fillRect(0, 0, worldWidth, GAME_HEIGHT);
    sky.setScrollFactor(0.05);
    objects.push(sky);

    // Dark glitter stars
    const stars = scene.add.graphics();
    for (let i = 0; i < 200; i++) {
      const color = [0xff00ff, 0xaa00ff, 0x6600cc, 0xffffff][Math.floor(Math.random() * 4)];
      stars.fillStyle(color, Math.random() * 0.7 + 0.2);
      stars.fillCircle(Math.random() * worldWidth, Math.random() * FLOOR_MIN_Y * 0.8, Math.random() * 2 + 0.3);
    }
    stars.setScrollFactor(0.08);
    objects.push(stars);

    // Twisted Disney castle silhouette
    const castle = scene.add.graphics();
    castle.fillStyle(0x1a0025, 1);
    // Main body
    castle.fillRect(600, 60, 400, 260);
    // Towers
    castle.fillRect(560, 40, 80, 280);
    castle.fillRect(960, 50, 80, 270);
    castle.fillRect(700, 20, 70, 320);
    castle.fillRect(830, 30, 70, 310);
    // Spires
    castle.fillTriangle(600, 40, 560, 40, 580, -20);
    castle.fillTriangle(640, 40, 600, 40, 620, -30);
    castle.fillTriangle(1000, 50, 960, 50, 980, -15);
    castle.fillTriangle(735, 20, 700, 20, 717, -35);
    castle.fillTriangle(865, 30, 830, 30, 847, -25);
    // Warped/twisted windows (glowing red)
    castle.fillStyle(0x990000, 0.7);
    for (let wx = 620; wx < 990; wx += 80) {
      castle.fillRect(wx, 120, 22, 32);
      castle.fillRect(wx, 180, 22, 32);
    }
    castle.setScrollFactor(0.15);
    objects.push(castle);

    // Floating distorted balloons
    const balloonColors = [0xff0066, 0x8800ff, 0x000088, 0x660000];
    for (let bx = 200; bx < worldWidth; bx += 400) {
      const balloon = scene.add.graphics();
      const bc = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const by = 60 + Math.random() * 160;
      balloon.fillStyle(bc, 0.85);
      // Warped balloon shape
      balloon.fillEllipse(bx, by, 38, 48);
      balloon.fillStyle(bc, 0.6);
      balloon.fillEllipse(bx - 8, by - 10, 20, 26);
      // String (wavy)
      balloon.lineStyle(1, 0x440044, 0.8);
      balloon.lineBetween(bx, by + 24, bx + 5, by + 45);
      balloon.lineBetween(bx + 5, by + 45, bx - 3, by + 65);
      balloon.setScrollFactor(0.2 + Math.random() * 0.1);
      objects.push(balloon);
    }

    // Dark mid-section
    const mid = scene.add.graphics();
    mid.fillStyle(0x1a0025, 1);
    mid.fillRect(0, FLOOR_MIN_Y - 100, worldWidth, 100);
    // Warped fence/gate silhouettes
    for (let fx = 0; fx < worldWidth; fx += 60) {
      mid.fillStyle(0x0d0018, 1);
      mid.fillRect(fx, FLOOR_MIN_Y - 90, 8, 90);
      mid.fillCircle(fx + 4, FLOOR_MIN_Y - 92, 6);
    }
    mid.setScrollFactor(0.5);
    objects.push(mid);

    // Floor — dark, shiny
    const floor = scene.add.graphics();
    floor.fillStyle(0x220030, 1);
    floor.fillRect(0, FLOOR_MIN_Y, worldWidth, GAME_HEIGHT - FLOOR_MIN_Y);
    // Glowing purple veins
    floor.lineStyle(1, 0x8800ff, 0.3);
    for (let x = 0; x < worldWidth; x += 150) {
      floor.lineBetween(x, FLOOR_MIN_Y, x + 60, FLOOR_MIN_Y + 60);
      floor.lineBetween(x + 60, FLOOR_MIN_Y + 60, x + 100, FLOOR_MIN_Y + 30);
    }
    // Dark reflective tiles
    floor.fillStyle(0x2a0040, 0.6);
    for (let x = 0; x < worldWidth; x += 80) {
      floor.fillRect(x + 4, FLOOR_MIN_Y + 4, 72, 20);
    }
    objects.push(floor);

    return objects;
  }
}
