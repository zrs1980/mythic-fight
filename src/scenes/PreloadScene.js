// Preload scene — generates all textures and shows loading bar

import { TextureManager } from '../managers/TextureManager.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  /** Show loading bar UI */
  create() {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(0, 0, width, height, 0x0a0a1a).setOrigin(0, 0);

    // Title
    this.add.text(width / 2, height * 0.28, 'MYTHIC FIGHT', {
      fontFamily: 'Arial Black, Impact',
      fontSize: '48px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Loading bar background
    const barBg = this.add.rectangle(width / 2, height * 0.58, 400, 24, 0x222222).setOrigin(0.5);
    const barFill = this.add.rectangle(width / 2 - 198, height * 0.58, 4, 20, 0x00cc44).setOrigin(0, 0.5);

    const loadText = this.add.text(width / 2, height * 0.68, 'Generating textures...', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Generate all textures (synchronous via Graphics API)
    TextureManager.createAll(this);

    // Animate bar to full
    this.tweens.add({
      targets: barFill,
      width: 396,
      duration: 600,
      ease: 'Linear',
      onComplete: () => {
        loadText.setText('Ready!');
        this.time.delayedCall(300, () => {
          this.scene.start('MenuScene');
        });
      },
    });
  }
}
