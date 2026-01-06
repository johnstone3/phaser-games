import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { WinScene } from "./scenes/WinScene";
import { IntroScene } from "./scenes/IntroScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [IntroScene, GameScene, WinScene],
  parent: "game-container", // Attach to the div with id 'game-container'
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
