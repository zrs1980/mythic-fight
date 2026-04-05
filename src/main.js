// Phaser game configuration and scene registry

import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#0a0a1a',
  parent: document.body,
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene,
    GameOverScene,
    VictoryScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
};

const game = new Phaser.Game(config);
