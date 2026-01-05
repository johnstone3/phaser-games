import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, width: number, height: number, color: number, callback: Function, borderThickness: number = 2, borderColor: number = 0x000000) {
        super(scene, x, y);

        const buttonBG = scene.add.rectangle(0, 0, width, height, color).setOrigin(0.5, 0.5);
        buttonBG.setStrokeStyle(borderThickness, borderColor);

        const buttonText = scene.add.text(0, 0, text, {
            fontSize: '12px',
            fill: '#000'
        }).setOrigin(0.5, 0.5);

        this.add([buttonBG, buttonText]);

        this.setInteractive(
            new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
            (hitArea: Phaser.Geom.Rectangle, x: number, y: number) => Phaser.Geom.Rectangle.Contains(hitArea, x, y)
        )
            .on('pointerdown', () => callback())
            .on('pointerover', () => buttonBG.setAlpha(0.8))
            .on('pointerout', () => buttonBG.setAlpha(1));
        


        scene.add.existing(this);
    }
}