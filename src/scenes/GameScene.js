// Main game scene — orchestrates all gameplay systems

import { LEVELS } from '../config/levelData.js';
import { WORLD_WIDTH, GAME_WIDTH, GAME_HEIGHT, FLOOR_MIN_Y, FLOOR_MAX_Y } from '../config/constants.js';
import { BackgroundManager } from '../managers/BackgroundManager.js';
import { WaveManager } from '../managers/WaveManager.js';
import { Player } from '../entities/Player.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  /** Receive level number from menu or previous level */
  init(data) {
    this._levelNum = data.level || 1;
    this._totalScore = data.score || 0;
  }

  /** Set up all game systems for the current level */
  create() {
    try {
      this._setup();
    } catch (err) {
      // Paint the error visibly so we can debug without opening DevTools
      this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000).setOrigin(0).setScrollFactor(0);
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'ERROR IN GAMESCENE', {
        fontFamily: 'monospace', fontSize: '18px', color: '#ff4444',
      }).setOrigin(0.5).setScrollFactor(0);
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, String(err), {
        fontFamily: 'monospace', fontSize: '13px', color: '#ffffff',
        wordWrap: { width: GAME_WIDTH - 40 },
      }).setOrigin(0.5).setScrollFactor(0);
      console.error('GameScene create() error:', err);
    }
  }

  /** Internal setup — separated so errors are catchable */
  _setup() {
    const levelData = LEVELS[this._levelNum - 1];
    this._levelData = levelData;
    this._worldWidth = WORLD_WIDTH;

    // Background
    this._bgObjects = BackgroundManager.createBackground(this, this._levelNum, WORLD_WIDTH);

    // Enemy group
    this._enemies = this.add.group();

    // Daggers array
    this._daggers = [];

    // Players
    this._player1 = new Player(this, 150, FLOOR_MIN_Y + 80, 0);
    this._player2 = new Player(this, 250, FLOOR_MIN_Y + 100, 1);
    this._players = [this._player1, this._player2];

    // Wave manager
    this._waveManager = new WaveManager();
    this._waveManager.init(this, levelData, this._enemies);

    // Camera
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);

    // HUD (fixed to camera)
    this._createHUD();

    // Boss health bar (hidden until boss spawns)
    this._bossBarVisible = false;
    this._createBossHUD();

    // Level name flash
    this._showLevelTitle(levelData.name, levelData.subtitle);

    this._levelClearSent = false;
  }

  /** Main update loop */
  update(time, delta) {
    if (!this._player1 || !this._waveManager) return;

    // Update players
    this._player1.update(delta, this._enemies);
    this._player2.update(delta, this._enemies);

    // Update enemies
    this._enemies.getChildren().forEach(enemy => {
      if (enemy && enemy.update) {
        enemy.update(delta, this._players);
      }
    });

    // Remove dead enemies from group and tally score
    const deadEnemies = this._enemies.getChildren().filter(e => !e.active);
    deadEnemies.forEach(e => {
      this._enemies.remove(e, false, false);
      this._totalScore++;
    });

    // Update daggers
    this._daggers = this._daggers.filter(d => d.active);
    this._daggers.forEach(d => d.update(delta, this._enemies));

    // Wave manager
    const aliveCount = this._enemies.getChildren().filter(e => e.active).length;
    const camX = this.cameras.main.scrollX;
    this._waveManager.update(delta, camX, aliveCount);

    // Camera follow (avg X of players, capped by world)
    this._updateCamera();

    // HUD update
    this._updateHUD();

    // Check boss HUD
    this._updateBossHUD();

    // Win / lose check
    this._checkWinLose();
  }

  // ── Camera ────────────────────────────────────────────────────────────────

  _updateCamera() {
    const avgX = (this._player1.x + this._player2.x) / 2;
    const targetX = Phaser.Math.Clamp(avgX - GAME_WIDTH / 2, 0, WORLD_WIDTH - GAME_WIDTH);
    this.cameras.main.setScrollX(Phaser.Math.Linear(this.cameras.main.scrollX, targetX, 0.06));
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  _createHUD() {
    const hudCam = this.cameras.main;
    const barW = 180, barH = 14;

    // P1 HUD
    this._p1HealthBg = this.add.graphics().setScrollFactor(0).setDepth(10000);
    this._p1HealthFill = this.add.graphics().setScrollFactor(0).setDepth(10001);
    this._p1Label = this.add.text(14, 8, 'LILY', {
      fontFamily: 'Arial Black', fontSize: '12px',
      color: '#ff99cc', stroke: '#000000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(10002);
    this._p1LivesText = this.add.text(14, 28, '♥♥♥♥♥', {
      fontFamily: 'Arial', fontSize: '13px', color: '#ff3366', stroke: '#000000', strokeThickness: 2,
    }).setScrollFactor(0).setDepth(10002);

    // P2 HUD
    this._p2HealthBg = this.add.graphics().setScrollFactor(0).setDepth(10000);
    this._p2HealthFill = this.add.graphics().setScrollFactor(0).setDepth(10001);
    this._p2Label = this.add.text(GAME_WIDTH - 14, 8, 'ROSE', {
      fontFamily: 'Arial Black', fontSize: '12px',
      color: '#bb88ff', stroke: '#000000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(10002).setOrigin(1, 0);
    this._p2LivesText = this.add.text(GAME_WIDTH - 14, 28, '♥♥♥♥♥', {
      fontFamily: 'Arial', fontSize: '13px', color: '#8855ff', stroke: '#000000', strokeThickness: 2,
    }).setScrollFactor(0).setDepth(10002).setOrigin(1, 0);

    // Wave progress bar
    this._waveBarBg = this.add.graphics().setScrollFactor(0).setDepth(10000);
    this._waveBarFill = this.add.graphics().setScrollFactor(0).setDepth(10001);
    this._waveLabel = this.add.text(GAME_WIDTH / 2, 8, this._levelData.name.toUpperCase(), {
      fontFamily: 'Arial Black', fontSize: '11px',
      color: '#ffcc44', stroke: '#000000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(10002).setOrigin(0.5, 0);

    this._drawWaveBar(0);
  }

  _updateHUD() {
    const p1 = this._player1.getHUDData();
    const p2 = this._player2.getHUDData();
    const barW = 180, barH = 14;
    const p1x = 14, p1y = 44;
    const p2x = GAME_WIDTH - 14 - barW, p2y = 44;

    // P1 health bar
    const p1ratio = p1.health / p1.maxHealth;
    this._p1HealthBg.clear();
    this._p1HealthBg.fillStyle(0x222222, 0.85);
    this._p1HealthBg.fillRoundedRect(p1x, p1y, barW, barH, 4);
    this._p1HealthFill.clear();
    this._p1HealthFill.fillStyle(this._hpColor(p1ratio), 1);
    this._p1HealthFill.fillRoundedRect(p1x + 1, p1y + 1, Math.max(2, (barW - 2) * p1ratio), barH - 2, 3);

    // P2 health bar
    const p2ratio = p2.health / p2.maxHealth;
    this._p2HealthBg.clear();
    this._p2HealthBg.fillStyle(0x222222, 0.85);
    this._p2HealthBg.fillRoundedRect(p2x, p2y, barW, barH, 4);
    this._p2HealthFill.clear();
    this._p2HealthFill.fillStyle(this._hpColor(p2ratio), 1);
    this._p2HealthFill.fillRoundedRect(p2x + 1, p2y + 1, Math.max(2, (barW - 2) * p2ratio), barH - 2, 3);

    // Lives
    const heart = '♥';
    this._p1LivesText.setText(heart.repeat(Math.max(0, p1.lives)));
    this._p2LivesText.setText(heart.repeat(Math.max(0, p2.lives)));

    // Wave bar
    this._drawWaveBar(this._waveManager.getProgress());
  }

  _hpColor(ratio) {
    if (ratio > 0.5) return 0x00cc44;
    if (ratio > 0.25) return 0xffcc00;
    return 0xff2222;
  }

  _drawWaveBar(progress) {
    const bw = 220, bh = 8;
    const bx = GAME_WIDTH / 2 - bw / 2;
    const by = 22;
    this._waveBarBg.clear();
    this._waveBarBg.fillStyle(0x222222, 0.85);
    this._waveBarBg.fillRoundedRect(bx, by, bw, bh, 3);
    this._waveBarFill.clear();
    this._waveBarFill.fillStyle(0x44aaff, 1);
    this._waveBarFill.fillRoundedRect(bx + 1, by + 1, Math.max(2, (bw - 2) * progress), bh - 2, 2);
  }

  _createBossHUD() {
    const bw = 400, bh = 18;
    const bx = GAME_WIDTH / 2 - bw / 2;
    const by = GAME_HEIGHT - 40;

    this._bossBarBg = this.add.graphics().setScrollFactor(0).setDepth(10000).setAlpha(0);
    this._bossBarFill = this.add.graphics().setScrollFactor(0).setDepth(10001).setAlpha(0);
    this._bossLabel = this.add.text(GAME_WIDTH / 2, by - 14, '', {
      fontFamily: 'Arial Black', fontSize: '13px',
      color: '#ff4444', stroke: '#000000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(10002).setOrigin(0.5, 1).setAlpha(0);

    this._bossBarBounds = { x: bx, y: by, w: bw, h: bh };
  }

  _updateBossHUD() {
    // Find boss enemy
    const boss = this._enemies.getChildren().find(e => e && e.isBoss && e.active);
    if (boss && !this._bossBarVisible) {
      this._bossBarVisible = true;
      this._bossBarBg.setAlpha(1);
      this._bossBarFill.setAlpha(1);
      this._bossLabel.setAlpha(1);
      this._bossLabel.setText(boss.bossName || 'BOSS');
    }
    if (!boss && this._bossBarVisible) {
      this._bossBarVisible = false;
      this._bossBarBg.setAlpha(0);
      this._bossBarFill.setAlpha(0);
      this._bossLabel.setAlpha(0);
    }
    if (boss && this._bossBarVisible) {
      const { x, y, w, h } = this._bossBarBounds;
      const ratio = boss.health / boss.maxHealth;
      this._bossBarBg.clear();
      this._bossBarBg.fillStyle(0x111111, 0.9);
      this._bossBarBg.fillRoundedRect(x, y, w, h, 5);
      this._bossBarFill.clear();
      this._bossBarFill.fillStyle(this._hpColor(ratio), 1);
      this._bossBarFill.fillRoundedRect(x + 2, y + 2, Math.max(2, (w - 4) * ratio), h - 4, 3);
    }
  }

  _showLevelTitle(name, subtitle) {
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, `LEVEL ${this._levelNum}`, {
      fontFamily: 'Arial Black', fontSize: '18px',
      color: '#ffcc44', stroke: '#000000', strokeThickness: 4,
    }).setScrollFactor(0).setDepth(20000).setOrigin(0.5);

    const nameText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 8, name.toUpperCase(), {
      fontFamily: 'Arial Black, Impact', fontSize: '42px',
      color: '#ffffff', stroke: '#000000', strokeThickness: 6,
    }).setScrollFactor(0).setDepth(20000).setOrigin(0.5);

    const sub = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55, subtitle, {
      fontFamily: 'Arial', fontSize: '18px',
      color: '#aaaaff', stroke: '#000000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(20000).setOrigin(0.5);

    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: [title, nameText, sub],
        alpha: 0, duration: 500,
        onComplete: () => { title.destroy(); nameText.destroy(); sub.destroy(); },
      });
    });
  }

  // ── Win/Lose ──────────────────────────────────────────────────────────────

  _checkWinLose() {
    if (this._levelClearSent) return;

    // Game over check
    const p1Dead = !this._player1.active;
    const p2Dead = !this._player2.active;
    if (p1Dead && p2Dead) {
      this._levelClearSent = true;
      this.time.delayedCall(1200, () => {
        this.scene.start('GameOverScene', {
          score: this._totalScore,
          level: this._levelNum,
        });
      });
      return;
    }

    // Level complete check
    if (this._waveManager.isLevelComplete()) {
      this._levelClearSent = true;

      const nextLevel = this._levelNum + 1;
      if (nextLevel > 5) {
        this.time.delayedCall(1500, () => {
          this.scene.start('VictoryScene', {
            score: this._totalScore,
            p1Lives: this._player1.lives,
            p2Lives: this._player2.lives,
          });
        });
      } else {
        this._showLevelTransition(() => {
          this.scene.start('GameScene', {
            level: nextLevel,
            score: this._totalScore,
          });
        });
      }
    }
  }

  _showLevelTransition(callback) {
    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
      .setScrollFactor(0).setDepth(30000).setOrigin(0, 0);

    const msg = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'LEVEL COMPLETE!', {
      fontFamily: 'Arial Black', fontSize: '52px',
      color: '#ffd700', stroke: '#000000', strokeThickness: 6,
    }).setScrollFactor(0).setDepth(30001).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: msg, alpha: 1, duration: 400, ease: 'Power2' });
    this.tweens.add({ targets: overlay, fillAlpha: 0.7, duration: 600, delay: 300 });

    this.time.delayedCall(1800, callback);
  }
}
