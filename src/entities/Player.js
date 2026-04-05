// Player entity with state machine, input handling, and combat

import {
  FLOOR_MIN_Y, FLOOR_MAX_Y,
  PLAYER_MAX_HP, PLAYER_LIVES,
  PUNCH_COOLDOWN, SHOOT_COOLDOWN, HURT_INVINCIBILITY,
  PUNCH_RANGE_X, PUNCH_RANGE_Y,
  JUMP_HEIGHT, JUMP_DURATION,
  GAME_WIDTH,
} from '../config/constants.js';
import { INPUT_P1, INPUT_P2 } from '../config/inputMap.js';
import { Dagger } from './Dagger.js';

const STATES = {
  IDLE: 'idle',
  WALKING: 'walking',
  JUMPING: 'jumping',
  ATTACKING: 'attacking',
  SHOOTING: 'shooting',
  HURT: 'hurt',
  DEAD: 'dead',
};

export class Player {

  /** Create a new player at position x, y */
  constructor(scene, x, y, playerIndex) {
    this.scene = scene;
    this.playerIndex = playerIndex;
    this.lives = PLAYER_LIVES;
    this.health = PLAYER_MAX_HP;
    this.maxHealth = PLAYER_MAX_HP;
    this.state = STATES.IDLE;
    this.facing = 'right';

    // Per-player configuration
    if (playerIndex === 0) {
      this.name = 'Lily';
      this.speed = 175;
      this.punchDamage = 10;
      this.texturePrefix = 'lily';
      this.hudColor = 0xff69b4;
    } else {
      this.name = 'Rose';
      this.speed = 145;
      this.punchDamage = 13;
      this.texturePrefix = 'rose';
      this.hudColor = 0x9966ff;
    }

    this.x = x;
    this.y = y;
    this._jumpOffsetY = 0;

    // Timers
    this._punchCooldown = 0;
    this._shootCooldown = 0;
    this._hurtTimer = 0;
    this._stateTimer = 0;
    this._animTimer = 0;
    this._walkFrame = 0;

    // Sprite
    this.sprite = scene.add.sprite(x, y, `${this.texturePrefix}_idle`);
    this.sprite.setDepth(y);

    // Input keys
    const map = playerIndex === 0 ? INPUT_P1 : INPUT_P2;
    this._keys = {
      up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[map.up]),
      down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[map.down]),
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[map.left]),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[map.right]),
      punch: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[map.punch]),
      shoot: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[map.shoot]),
    };

    // Respawn flash indicator
    this._invincible = false;
    this._flashTimer = 0;

    // Daggers array
    this.daggers = [];

    // Score
    this.score = 0;

    // Active flag
    this.active = true;
  }

  /** Main update — reads input, moves, handles combat */
  update(delta, enemies) {
    if (!this.active) return;

    const dt = delta / 1000;

    // Cooldown timers
    this._punchCooldown -= delta;
    this._shootCooldown -= delta;
    this._stateTimer -= delta;
    this._animTimer -= delta;
    this._flashTimer -= delta;

    // Invincibility flash
    if (this._invincible) {
      this._hurtTimer -= delta;
      this.sprite.setAlpha(Math.floor(Date.now() / 80) % 2 === 0 ? 0.3 : 1);
      if (this._hurtTimer <= 0) {
        this._invincible = false;
        this.sprite.setAlpha(1);
      }
    }

    if (this.state === STATES.DEAD) return;
    if (this.state === STATES.HURT && this._stateTimer > 0) {
      this._setFrame('hurt');
      this.sprite.setPosition(this.x, this.y + this._jumpOffsetY);
      this.sprite.setFlipX(this.facing === 'left');
      return;
    }
    if (this.state === STATES.HURT && this._stateTimer <= 0) {
      this.state = STATES.IDLE;
    }

    // Jump lock — no horizontal movement blocked, just visually jumping
    const isJumping = this.state === STATES.JUMPING;

    // Attack states are locked briefly
    if (this.state === STATES.ATTACKING && this._stateTimer > 0) {
      this._setFrame('attack');
      this.sprite.setPosition(this.x, this.y + this._jumpOffsetY);
      this.sprite.setFlipX(this.facing === 'left');
      return;
    }
    if (this.state === STATES.SHOOTING && this._stateTimer > 0) {
      this._setFrame('attack');
      this.sprite.setPosition(this.x, this.y + this._jumpOffsetY);
      this.sprite.setFlipX(this.facing === 'left');
      return;
    }
    if ((this.state === STATES.ATTACKING || this.state === STATES.SHOOTING) && this._stateTimer <= 0) {
      this.state = STATES.IDLE;
    }

    // Handle input
    const k = this._keys;
    let moving = false;
    let vx = 0, vy = 0;

    if (Phaser.Input.Keyboard.JustDown(k.punch) && this._punchCooldown <= 0) {
      this._doPunch(enemies);
      this.sprite.setPosition(this.x, this.y + this._jumpOffsetY);
      this.sprite.setFlipX(this.facing === 'left');
      this.sprite.setDepth(this.y);
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(k.shoot) && this._shootCooldown <= 0) {
      this._doShoot();
      this.sprite.setPosition(this.x, this.y + this._jumpOffsetY);
      this.sprite.setFlipX(this.facing === 'left');
      this.sprite.setDepth(this.y);
      return;
    }

    if (k.left.isDown) { vx = -this.speed; this.facing = 'left'; moving = true; }
    if (k.right.isDown) { vx = this.speed; this.facing = 'right'; moving = true; }
    if (k.up.isDown) { vy = -this.speed * 0.6; moving = true; }
    if (k.down.isDown) { vy = this.speed * 0.6; moving = true; }

    // Move
    if (moving) {
      this.x += vx * dt;
      this.y += vy * dt;
      // Clamp
      this.x = Phaser.Math.Clamp(this.x, 30, this.scene._worldWidth - 30);
      this.y = Phaser.Math.Clamp(this.y, FLOOR_MIN_Y + 10, FLOOR_MAX_Y - 5);
      this.state = STATES.WALKING;

      // Walk animation
      if (this._animTimer <= 0) {
        this._walkFrame = (this._walkFrame + 1) % 2;
        this._animTimer = 140;
      }
      this._setFrame(`walk${this._walkFrame + 1}`);
    } else {
      this.state = STATES.IDLE;
      this._setFrame('idle');
    }

    // Jump on UP+punch (or double tap up) — cosmetic only
    if (Phaser.Input.Keyboard.JustDown(k.up) && !isJumping) {
      this._doJump();
    }

    // Apply jump visual offset
    this.sprite.setPosition(this.x, this.y + this._jumpOffsetY);
    this.sprite.setFlipX(this.facing === 'left');
    this.sprite.setDepth(this.y);
  }

  /** Deal punch damage to nearby enemies */
  punch(enemies) {
    let hit = false;
    if (!enemies) return hit;
    enemies.getChildren().forEach(enemy => {
      if (!enemy.active || enemy.state === 'dead') return;
      const dx = Math.abs(this.x - enemy.x);
      const dy = Math.abs(this.y - enemy.y);
      if (dx < PUNCH_RANGE_X && dy < PUNCH_RANGE_Y) {
        enemy.takeDamage(this.punchDamage);
        enemy.applyKnockback(this.x);
        hit = true;
        this.score += 5;
      }
    });
    return hit;
  }

  /** Create a dagger projectile in the current facing direction */
  shootDagger(daggersArray) {
    const offsetX = this.facing === 'right' ? 30 : -30;
    const dagger = new Dagger(this.scene, this.x + offsetX, this.y - 10, this.facing, this.playerIndex);
    daggersArray.push(dagger);
  }

  /** Reduce HP and enter hurt state with invincibility window */
  takeDamage(amount) {
    if (!this.active || this._invincible || this.state === STATES.DEAD) return;

    this.health = Math.max(0, this.health - amount);

    if (this.health <= 0) {
      this._die();
    } else {
      this.state = STATES.HURT;
      this._stateTimer = 300;
      this._invincible = true;
      this._hurtTimer = HURT_INVINCIBILITY;
      this.sprite.setTint(0xff4444);
      this.scene.time.delayedCall(200, () => {
        if (this.sprite) this.sprite.clearTint();
      });
    }
  }

  /** Get current HUD data for rendering */
  getHUDData() {
    return {
      health: this.health,
      maxHealth: this.maxHealth,
      lives: this.lives,
      score: this.score,
      name: this.name,
      hudColor: this.hudColor,
    };
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _doPunch(enemies) {
    this.state = STATES.ATTACKING;
    this._stateTimer = PUNCH_COOLDOWN * 0.6;
    this._punchCooldown = PUNCH_COOLDOWN;
    this._setFrame('attack');
    // Slight lunge forward
    this.x += this.facing === 'right' ? 12 : -12;
    this.punch(enemies);
  }

  _doShoot() {
    this.state = STATES.SHOOTING;
    this._stateTimer = SHOOT_COOLDOWN * 0.4;
    this._shootCooldown = SHOOT_COOLDOWN;
    this._setFrame('attack');
    // Delegate to scene to add to daggers array
    if (this.scene._daggers) {
      this.shootDagger(this.scene._daggers);
    }
  }

  _doJump() {
    if (this.state === STATES.JUMPING) return;
    this.state = STATES.JUMPING;
    this.scene.tweens.add({
      targets: this,
      _jumpOffsetY: -JUMP_HEIGHT,
      duration: JUMP_DURATION * 0.45,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => {
        this._jumpOffsetY = 0;
        if (this.state === STATES.JUMPING) this.state = STATES.IDLE;
      },
    });
  }

  _die() {
    this.lives--;

    if (this.lives > 0) {
      // Respawn
      this.health = this.maxHealth * 0.6;
      this._invincible = true;
      this._hurtTimer = 3000;
      this.state = STATES.HURT;
      this._stateTimer = 500;
      // Flash effect
      this.scene.cameras.main.flash(300, 255, 0, 0, false);
    } else {
      this.state = STATES.DEAD;
      this.active = false;
      this.sprite.setAlpha(0.3);
      this.sprite.setTint(0x444444);
    }
  }

  _setFrame(frameName) {
    const key = `${this.texturePrefix}_${frameName}`;
    if (this.scene.textures.exists(key)) {
      this.sprite.setTexture(key);
    }
  }
}
