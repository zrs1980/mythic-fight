// Main menu scene with animated background, title, and controls display

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this._stars = [];
    this._blinkTimer = 0;
    this._pressText = null;
  }

  /** Build the menu */
  create() {
    const { width, height } = this.scale;

    // Animated star background
    this._starGfx = this.add.graphics();
    this._generateStars(width, height);

    // Gradient title background glow
    const glow = this.add.graphics();
    glow.fillStyle(0x4400aa, 0.25);
    glow.fillEllipse(width / 2, height * 0.3, 700, 180);

    // Title
    const title = this.add.text(width / 2, height * 0.22, 'MYTHIC FIGHT', {
      fontFamily: 'Arial Black, Impact',
      fontSize: '72px',
      color: '#ffd700',
      stroke: '#330088',
      strokeThickness: 8,
    }).setOrigin(0.5);

    // Pulse glow on title
    this.tweens.add({
      targets: title,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(width / 2, height * 0.38, 'A Mythic Griffin Beat-Em-Up', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#cc88ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Griffin silhouettes (decorative)
    if (this.textures.exists('lily_idle')) {
      const p1 = this.add.sprite(width * 0.22, height * 0.55, 'lily_idle').setScale(2.2).setAlpha(0.7);
      const p2 = this.add.sprite(width * 0.78, height * 0.55, 'rose_idle').setScale(2.2).setAlpha(0.7).setFlipX(true);

      this.tweens.add({ targets: p1, y: height * 0.53, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: p2, y: height * 0.53, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 200 });
    }

    // Press space text (blinking)
    this._pressText = this.add.text(width / 2, height * 0.70, 'PRESS SPACE TO START', {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this._pressText,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Linear',
    });

    // Controls display
    const ctrlY = height * 0.82;
    this.add.text(width / 2, ctrlY - 14, 'CONTROLS', {
      fontFamily: 'Arial Black',
      fontSize: '13px',
      color: '#ffcc44',
    }).setOrigin(0.5);

    this.add.text(width * 0.28, ctrlY + 10, 'P1 (Lily): WASD Move\nF = Claw Punch  G = Dagger', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ff99cc',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    this.add.text(width * 0.72, ctrlY + 10, 'P2 (Rose): Arrow Keys Move\nK = Claw Punch  L = Dagger', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#bb88ff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    // Space bar to start
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.once('down', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('GameScene', { level: 1 });
      });
    });
  }

  /** Animate stars each frame */
  update(time, delta) {
    this._starGfx.clear();
    this._stars.forEach(star => {
      star.twinkle = (star.twinkle + delta * 0.003) % (Math.PI * 2);
      const alpha = 0.4 + Math.sin(star.twinkle) * 0.4;
      this._starGfx.fillStyle(star.color, alpha);
      this._starGfx.fillCircle(star.x, star.y, star.r);
    });
  }

  _generateStars(width, height) {
    this.add.rectangle(0, 0, width, height, 0x0a0a1a).setOrigin(0, 0);
    this._stars = [];
    for (let i = 0; i < 140; i++) {
      this._stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.3,
        color: [0xffffff, 0xffddff, 0xddddff, 0xffff88][Math.floor(Math.random() * 4)],
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }
}
