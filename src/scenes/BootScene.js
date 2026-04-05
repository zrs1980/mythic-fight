// Boot scene — minimal startup, immediately goes to preload

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  /** Set default scale mode and immediately advance to preload */
  create() {
    this.scene.start('PreloadScene');
  }
}
