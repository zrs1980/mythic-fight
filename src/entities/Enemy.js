// Enemy entity with AI state machine

import {
  FLOOR_MIN_Y, FLOOR_MAX_Y,
  ENEMY_WINDUP_MS, ENEMY_ATTACK_COOLDOWN,
  ENEMY_HIT_RANGE_X, ENEMY_HIT_RANGE_Y,
} from '../config/constants.js';

const STATES = {
  APPROACHING: 'approaching',
  WINDUP: 'windup',
  ATTACKING: 'attacking',
  HURT: 'hurt',
  DEAD: 'dead',
};

export class Enemy {

  /** Create a new enemy at position x, y */
  constructor(scene, x, y, type, levelData, isBoss, bossName) {
    this.scene = scene;
    this.type = type;
    this.isBoss = isBoss;
    this.bossName = bossName;

    // Stats from level data
    this.maxHealth = isBoss ? levelData.bossHP : levelData.enemyHP;
    this.health = this.maxHealth;
    this.damage = levelData.enemyDamage;
    this.speed = isBoss ? levelData.enemySpeed * 0.75 : levelData.enemySpeed;

    this.x = x;
    this.y = y;
    this.facing = 'left';

    this.state = STATES.APPROACHING;
    this._stateTimer = 0;
    this._attackCooldown = 0;
    this.active = true;
    this._flashTimer = 0;
    this._target = null;

    // Create sprite
    const prefix = isBoss ? type : type;
    this.sprite = scene.add.sprite(x, y, `${prefix}_idle`);
    if (isBoss) {
      this.sprite.setScale(isBoss ? 1.3 : 1.0);
    }
    this.sprite.setDepth(y);

    // Health bar (for boss always visible, for enemies shows on damage)
    this._healthBarBg = scene.add.graphics();
    this._healthBarFill = scene.add.graphics();
    this._healthBarVisible = isBoss;
    this._updateHealthBar();

    if (isBoss && bossName) {
      this._bossLabel = scene.add.text(x, y - 60, bossName, {
        fontFamily: 'Arial Black',
        fontSize: '11px',
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5, 1).setDepth(1000);
    }

    // Entrance tween
    this.sprite.setAlpha(0);
    scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      duration: 300,
      ease: 'Linear',
    });
  }

  /** Main AI update — called each frame */
  update(delta, players) {
    if (!this.active || this.state === STATES.DEAD) return;

    const dt = delta / 1000;
    this._stateTimer -= delta;
    this._attackCooldown -= delta;
    this._flashTimer -= delta;

    // Flash white on hurt
    if (this._flashTimer > 0) {
      this.sprite.setTint(0xffffff);
    } else {
      this.sprite.clearTint();
    }

    // Find nearest player
    const nearest = this._findNearest(players);
    this._target = nearest;

    switch (this.state) {
      case STATES.APPROACHING:
        this._approachUpdate(dt, nearest);
        break;
      case STATES.WINDUP:
        this._windupUpdate(nearest);
        break;
      case STATES.ATTACKING:
        this._attackUpdate(nearest);
        break;
      case STATES.HURT:
        if (this._stateTimer <= 0) {
          this.state = STATES.APPROACHING;
        }
        break;
    }

    // Clamp Y to floor
    this.y = Phaser.Math.Clamp(this.y, FLOOR_MIN_Y + 10, FLOOR_MAX_Y - 5);
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setDepth(this.y);
    this.sprite.setFlipX(this.facing === 'right');

    // Update health bar
    if (this._healthBarVisible) {
      this._updateHealthBar();
    }
    if (this._bossLabel) {
      this._bossLabel.setPosition(this.x, this.y - (this.isBoss ? 55 : 45));
    }
  }

  /** Deal damage to this enemy */
  takeDamage(amount) {
    if (!this.active || this.state === STATES.DEAD) return;

    this.health = Math.max(0, this.health - amount);
    this._flashTimer = 180;
    this._healthBarVisible = true;

    if (this.health <= 0) {
      this._die();
    } else {
      this.state = STATES.HURT;
      this._stateTimer = 250;
      this._setFrame('hurt');
    }
  }

  /** Apply knockback from a hit */
  applyKnockback(fromX) {
    const dir = this.x > fromX ? 1 : -1;
    this.x += dir * 55;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _approachUpdate(dt, nearest) {
    if (!nearest) return;

    const dx = nearest.x - this.x;
    const dy = nearest.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Face player
    this.facing = dx > 0 ? 'right' : 'left';

    // Walk animation
    const walkFrame = Math.floor(Date.now() / 200) % 2 === 0 ? 'walk1' : 'walk2';
    this._setFrame(walkFrame);

    if (dist < 60) {
      // Enter windup if attack cooldown ready
      if (this._attackCooldown <= 0) {
        this.state = STATES.WINDUP;
        this._stateTimer = ENEMY_WINDUP_MS;
        this._setFrame('idle');
      }
    } else {
      // Move toward player
      const speed = this.speed;
      this.x += (dx / dist) * speed * dt;
      this.y += (dy / dist) * speed * 0.5 * dt;
    }
  }

  _windupUpdate(nearest) {
    // Telegraphed windup - shake slightly
    if (this._stateTimer <= 0) {
      this.state = STATES.ATTACKING;
      this._stateTimer = 300;
      this._setFrame('attack');
    } else {
      // Windup animation - slight vibration effect
      const vibrate = Math.sin(this._stateTimer * 0.04) * 3;
      this.sprite.setX(this.x + vibrate);
    }
  }

  _attackUpdate(nearest) {
    if (this._stateTimer <= 0) {
      this.state = STATES.APPROACHING;
      this._attackCooldown = ENEMY_ATTACK_COOLDOWN;
      return;
    }

    // Deal damage if player is in range
    if (nearest && nearest.state !== 'dead' && nearest.state !== 'hurt') {
      const dx = Math.abs(this.x - nearest.x);
      const dy = Math.abs(this.y - nearest.y);
      if (dx < ENEMY_HIT_RANGE_X && dy < ENEMY_HIT_RANGE_Y) {
        nearest.takeDamage(this.damage);
      }
    }
  }

  _die() {
    this.state = STATES.DEAD;
    this.active = false;

    // Sparkle death effect
    this._spawnDeathParticles();

    // Remove sprite and UI
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        if (this.sprite) this.sprite.destroy();
        if (this._healthBarBg) this._healthBarBg.destroy();
        if (this._healthBarFill) this._healthBarFill.destroy();
        if (this._bossLabel) this._bossLabel.destroy();
      },
    });
  }

  _spawnDeathParticles() {
    const colors = [0xffff00, 0xff8800, 0xff44ff, 0x44ffff, 0x00ff88];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 80 + Math.random() * 120;
      const starKey = `star_${i % 5}`;
      const star = this.scene.add.sprite(this.x, this.y, starKey);
      star.setDepth(2000);
      star.setTint(colors[i % colors.length]);
      const targetX = this.x + Math.cos(angle) * speed;
      const targetY = this.y + Math.sin(angle) * speed * 0.5;
      this.scene.tweens.add({
        targets: star,
        x: targetX,
        y: targetY,
        alpha: 0,
        angle: 360,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 500 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => star.destroy(),
      });
    }
  }

  _findNearest(players) {
    if (!players) return null;
    let nearest = null;
    let minDist = Infinity;
    players.forEach(p => {
      if (!p || p.state === 'dead') return;
      const dx = this.x - p.x;
      const dy = this.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) {
        minDist = d;
        nearest = p;
      }
    });
    return nearest;
  }

  _setFrame(frameName) {
    const key = `${this.type}_${frameName}`;
    if (this.scene.textures.exists(key)) {
      this.sprite.setTexture(key);
    }
  }

  _updateHealthBar() {
    const barW = this.isBoss ? 80 : 48;
    const barH = 5;
    const bx = this.x - barW / 2;
    const by = this.y - (this.isBoss ? 68 : 44);
    const hpRatio = this.health / this.maxHealth;

    this._healthBarBg.clear();
    this._healthBarBg.fillStyle(0x222222, 0.8);
    this._healthBarBg.fillRect(bx, by, barW, barH);
    this._healthBarBg.setDepth(this.y + 1);

    const fillColor = hpRatio > 0.5 ? 0x00cc44 : (hpRatio > 0.25 ? 0xffcc00 : 0xff2222);
    this._healthBarFill.clear();
    this._healthBarFill.fillStyle(fillColor, 1);
    this._healthBarFill.fillRect(bx, by, barW * hpRatio, barH);
    this._healthBarFill.setDepth(this.y + 2);
  }
}
