// Dagger projectile entity — travels horizontally until hitting an enemy or bounds

import { DAGGER_SPEED, DAGGER_DAMAGE, WORLD_WIDTH } from '../config/constants.js';

export class Dagger {

  /** Create a new dagger projectile */
  constructor(scene, x, y, facing, playerIndex) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.facing = facing; // 'left' or 'right'
    this.playerIndex = playerIndex;
    this.damage = DAGGER_DAMAGE;
    this.active = true;
    this.speed = facing === 'right' ? DAGGER_SPEED : -DAGGER_SPEED;

    const textureKey = playerIndex === 0 ? 'dagger_p1' : 'dagger_p2';
    this.sprite = scene.add.sprite(x, y, textureKey);
    this.sprite.setDepth(500);
    if (facing === 'left') {
      this.sprite.setFlipX(true);
    }

    // Glow tween
    scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 1, to: 0.7 },
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }

  /** Update position and check collisions each frame */
  update(delta, enemies) {
    if (!this.active) return;

    const dt = delta / 1000;
    this.x += this.speed * dt;
    this.sprite.setPosition(this.x, this.y);

    // Destroy if out of world bounds
    if (this.x < -50 || this.x > WORLD_WIDTH + 50) {
      this.destroy();
      return;
    }

    // Check collision with enemies
    if (enemies) {
      enemies.getChildren().forEach(enemy => {
        if (!enemy.active || !this.active) return;
        const dx = Math.abs(this.x - enemy.x);
        const dy = Math.abs(this.y - enemy.y);
        if (dx < 35 && dy < 38) {
          enemy.takeDamage(this.damage);
          this.destroy();
        }
      });
    }
  }

  /** Deactivate and remove the dagger from the scene */
  destroy() {
    if (!this.active) return;
    this.active = false;
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}
