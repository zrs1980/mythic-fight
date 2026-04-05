// Victory scene — shown when all 5 levels are completed

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  /** Receive final stats from GameScene */
  init(data) {
    this._score = data.score || 0;
    this._p1Lives = data.p1Lives || 0;
    this._p2Lives = data.p2Lives || 0;
  }

  /** Build victory celebration UI */
  create() {
    const { width, height } = this.scale;

    // Deep gold background
    this.add.rectangle(0, 0, width, height, 0x110800).setOrigin(0, 0);

    // Particle celebration
    this._particles = [];
    this._createCelebrationParticles(width, height);

    // VICTORY! text
    const victory = this.add.text(width / 2, height * 0.22, 'VICTORY!', {
      fontFamily: 'Arial Black, Impact',
      fontSize: '88px',
      color: '#ffd700',
      stroke: '#884400',
      strokeThickness: 8,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: victory,
      alpha: 1,
      scaleX: { from: 0.3, to: 1 },
      scaleY: { from: 0.3, to: 1 },
      duration: 800,
      ease: 'Back.easeOut',
    });

    // Subtitle
    this.add.text(width / 2, height * 0.42, 'The Mythic Griffins have saved the world!', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffeeaa',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.50, 'Thanks for playing Mythic Fight!', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#cc88ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Stats
    const statsY = height * 0.62;
    this.add.text(width / 2, statsY, `Total Enemies Defeated: ${this._score}`, {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, statsY + 36, `Lily surviving lives: ${this._p1Lives}   Rose surviving lives: ${this._p2Lives}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffccee',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Griffin sprites (celebrating)
    if (this.textures.exists('lily_idle')) {
      const lily = this.add.sprite(width * 0.3, height * 0.78, 'lily_idle').setScale(2.5);
      const rose = this.add.sprite(width * 0.7, height * 0.78, 'rose_idle').setScale(2.5).setFlipX(true);

      this.tweens.add({ targets: lily, y: height * 0.74, duration: 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: rose, y: height * 0.74, duration: 380, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 100 });
    }

    // Press space to return
    const pressText = this.add.text(width / 2, height * 0.92, 'PRESS SPACE TO RETURN TO MENU', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: pressText,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.once('down', () => {
      this.cameras.main.fade(500, 0, 0, 0, false, (cam, progress) => {
        if (progress === 1) {
          this.scene.start('MenuScene');
        }
      });
    });
  }

  /** Animate celebration particles */
  update(time, delta) {
    this._particles.forEach(p => {
      p.y += p.vy * (delta / 1000);
      p.x += p.vx * (delta / 1000);
      p.vy += 80 * (delta / 1000);
      p.life -= delta;
      if (p.sprite) {
        p.sprite.setPosition(p.x, p.y);
        p.sprite.setAlpha(Math.max(0, p.life / p.maxLife));
        p.sprite.rotation += p.spin * (delta / 1000);
        if (p.life <= 0) {
          p.sprite.destroy();
          p.sprite = null;
        }
      }
    });
    // Continuously spawn new particles
    if (Math.random() < 0.3) {
      this._spawnParticle(this.scale.width, this.scale.height);
    }
    // Clean dead particles
    this._particles = this._particles.filter(p => p.sprite !== null);
  }

  _createCelebrationParticles(width, height) {
    for (let i = 0; i < 40; i++) {
      this._spawnParticle(width, height);
    }
  }

  _spawnParticle(width, height) {
    const colors = [0xffd700, 0xff8800, 0xff44ff, 0x44ffff, 0x00ff88, 0xff4444, 0xffffff];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * width;
    const startY = height + 20;
    const key = `star_${Math.floor(Math.random() * 5)}`;
    const sprite = this.add.sprite(x, startY, key);
    sprite.setTint(color);
    sprite.setDepth(3000);
    this._particles.push({
      x, y: startY,
      vx: (Math.random() - 0.5) * 120,
      vy: -(200 + Math.random() * 200),
      spin: (Math.random() - 0.5) * 8,
      life: 2000 + Math.random() * 2000,
      maxLife: 4000,
      sprite,
    });
  }
}
