// Manages enemy wave spawning and level progression

import { MAX_ENEMIES, WORLD_WIDTH, GAME_WIDTH, FLOOR_MIN_Y, FLOOR_MAX_Y } from '../config/constants.js';
import { Enemy } from '../entities/Enemy.js';

export class WaveManager {

  constructor() {
    this.scene = null;
    this.levelData = null;
    this.enemiesGroup = null;
    this.currentWave = 0;
    this.totalWaves = 0;
    this.waveCleared = false;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.levelComplete = false;
    this.progress = 0;
    this._pendingSpawn = [];
    this._spawnTimer = 0;
    this.allEnemies = [];
  }

  /** Initialize wave manager for a new level */
  init(scene, levelData, enemiesGroup) {
    this.scene = scene;
    this.levelData = levelData;
    this.enemiesGroup = enemiesGroup;
    this.currentWave = 0;
    this.totalWaves = levelData.wavesCount;
    this.waveCleared = true;  // triggers first wave spawn
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.levelComplete = false;
    this.progress = 0;
    this._pendingSpawn = [];
    this._spawnTimer = 0;
    this.allEnemies = [];
  }

  /** Update each frame — spawn waves when appropriate */
  update(delta, cameraX, aliveEnemies) {
    if (this.levelComplete) return;

    // Handle pending spawns with stagger delay
    if (this._pendingSpawn.length > 0) {
      this._spawnTimer -= delta;
      if (this._spawnTimer <= 0) {
        const spawnData = this._pendingSpawn.shift();
        this._spawnEnemy(spawnData);
        this._spawnTimer = 200; // 200ms between each enemy spawn
      }
    }

    // Determine if we should trigger next wave
    if (this.waveCleared && this._pendingSpawn.length === 0) {
      if (this.currentWave < this.totalWaves) {
        this._startNextWave(cameraX);
        this.waveCleared = false;
      } else if (!this.bossSpawned) {
        this._spawnBoss(cameraX);
        this.bossSpawned = true;
        this.waveCleared = false;
      }
    }

    // Check if current wave is cleared
    if (!this.waveCleared && this._pendingSpawn.length === 0) {
      if (aliveEnemies === 0) {
        if (this.bossSpawned && !this.bossDefeated) {
          this.bossDefeated = true;
          this.levelComplete = true;
        } else if (!this.bossSpawned) {
          this.waveCleared = true;
        }
      }
    }

    // Update progress (0.0 to 1.0)
    const wavesCompleted = this.bossDefeated ? this.totalWaves + 1 :
      (this.bossSpawned ? this.totalWaves : this.currentWave);
    this.progress = Math.min(1, wavesCompleted / (this.totalWaves + 1));
  }

  /** Get current progress (0.0 to 1.0) */
  getProgress() {
    return this.progress;
  }

  /** Check if the level is complete (boss defeated) */
  isLevelComplete() {
    return this.levelComplete;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _startNextWave(cameraX) {
    this.currentWave++;
    const count = this.levelData.enemiesPerWave[this.currentWave - 1] || 2;
    const spawnX = cameraX + GAME_WIDTH * 0.7;

    for (let i = 0; i < count; i++) {
      const offsetX = spawnX + (i % 2 === 0 ? 80 : 180) + i * 30;
      const offsetY = FLOOR_MIN_Y + Math.random() * (FLOOR_MAX_Y - FLOOR_MIN_Y);
      this._pendingSpawn.push({
        type: this.levelData.enemyType,
        x: Math.min(offsetX, WORLD_WIDTH - 100),
        y: offsetY,
        isBoss: false,
      });
    }
    this._spawnTimer = 100;
  }

  _spawnBoss(cameraX) {
    const spawnX = Math.min(cameraX + GAME_WIDTH * 0.75, WORLD_WIDTH - 120);
    const spawnY = FLOOR_MIN_Y + (FLOOR_MAX_Y - FLOOR_MIN_Y) * 0.5;
    this._pendingSpawn.push({
      type: this.levelData.bossType,
      x: spawnX,
      y: spawnY,
      isBoss: true,
      name: this.levelData.bossName,
    });
    this._spawnTimer = 500;
  }

  _spawnEnemy(spawnData) {
    if (!this.scene || !this.scene.sys.isActive()) return;

    const enemy = new Enemy(
      this.scene,
      spawnData.x,
      spawnData.y,
      spawnData.type,
      this.levelData,
      spawnData.isBoss,
      spawnData.name || null
    );

    this.enemiesGroup.add(enemy);
    this.allEnemies.push(enemy);
  }
}
