import Phaser from 'phaser';
import { GameScene } from './GameScene';
import { WinScene } from './WinScene';
import { IntroScene } from './IntroScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [IntroScene, GameScene, WinScene],
    parent: 'game-container', // Attach to the div with id 'game-container'
    scale: {
        mode: Phaser.Scale.NONE, // Scale the game to fit the container
        // Center the game within the container
    }
};

const game = new Phaser.Game(config);