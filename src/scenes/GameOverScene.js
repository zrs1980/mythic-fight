// Game Over scene — shown when both players are defeated

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  /** Receive score data from GameScene */
  init(data) {
    this._score = data.score || 0;
    this._level = data.level || 1;
  }

  /** Build game over UI */
  create() {
    const { width, height } = this.scale;

    // Dark background
    this.add.rectangle(0, 0, width, height, 0x0a0005).setOrigin(0, 0);

    // Blood red vignette
    const vig = this.add.graphics();
    vig.fillStyle(0x330000, 0.5);
    vig.fillRect(0, 0, width, height * 0.35);
    vig.fillRect(0, height * 0.65, width, height * 0.35);

    // GAME OVER text
    const gameOver = this.add.text(width / 2, height * 0.32, 'GAME OVER', {
      fontFamily: 'Arial Black, Impact',
      fontSize: '80px',
      color: '#ff2222',
      stroke: '#220000',
      strokeThickness: 8,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: gameOver,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
    });

    // Score
    this.add.text(width / 2, height * 0.54, `Enemies Defeated: ${this._score}`, {
      fontFamily: 'Arial Black',
      fontSize: '26px',
      color: '#ffaa44',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.64, `Reached Level ${this._level}`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ccaaff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Press space text
    const pressText = this.add.text(width / 2, height * 0.80, 'PRESS SPACE TO TRY AGAIN', {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: pressText,
      alpha: 0.1,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    // Space bar to restart
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.once('down', () => {
      this.cameras.main.fade(400, 0, 0, 0, false, (cam, progress) => {
        if (progress === 1) {
          this.scene.start('GameScene', { level: 1 });
        }
      });
    });
  }
}
