import Phaser from "phaser";
import type { GameScene } from "../scenes/GameScene";

export class DraggableGroup extends Phaser.GameObjects.Container {
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  constructor(scene: Phaser.Scene, x: number, y: number, labels: string[]) {
    super(scene, x, y);

    let currentX: number = 0;
    const boxWidth: number = 30;
    const boxHeight: number = 30;

    for (const label of labels) {
      const box: Phaser.GameObjects.Graphics = scene.add.graphics();
      const r: number = Math.floor(Math.random() * 155) + 100;
      const g: number = Math.floor(Math.random() * 155) + 100;
      const b: number = Math.floor(Math.random() * 155) + 100;
      const color: number = (r << 16) | (g << 8) | b;
      box.fillStyle(color, 1);
      box.fillRect(0, 0, boxWidth, boxHeight);
      box.lineStyle(1, 0x000000);
      box.strokeRect(0, 0, boxWidth, boxHeight);

      const text: Phaser.GameObjects.Text = scene.add
        .text(boxWidth / 2, boxHeight / 2, label, {
          fontSize: "12px",
          color: "#000",
        })
        .setOrigin(0.5);

      const boxContainer: Phaser.GameObjects.Container = scene.add.container(
        currentX,
        0,
        [box, text],
      );
      boxContainer.setData("letter", label);
      this.add(boxContainer);
      currentX += boxWidth;
    }

    this.setSize(currentX, boxHeight);

    const hitZone = this.scene.add.zone(0, 0, currentX, boxHeight).setOrigin(0);
    this.addAt(hitZone, 0); // Add the zone as the first child (at the bottom)

    hitZone.setInteractive();
    this.scene.input.setDraggable(hitZone);

    // Listen for drag events directly on the hitZone
    hitZone.on(
      "dragstart",
      (
        pointer: Phaser.Input.Pointer,
        draggedObject: Phaser.GameObjects.GameObject,
      ) => {
        this.scene.children.bringToTop(this); // Bring the parent DraggableGroup to top
        // Calculate and store the offset from the DraggableGroup's top-left to the initial click point
        this.dragOffsetX = pointer.x - this.x;
        this.dragOffsetY = pointer.y - this.y;
      },
    );

    hitZone.on(
      "drag",
      (
        pointer: Phaser.Input.Pointer,
        draggedObject: Phaser.GameObjects.GameObject,
      ) => {
        // Update the parent DraggableGroup's position
        // Maintain the initial offset relative to the current pointer position
        this.x = pointer.x - this.dragOffsetX;
        this.y = pointer.y - this.dragOffsetY;
      },
    );

    hitZone.on(
      "dragend",
      (
        pointer: Phaser.Input.Pointer,
        draggedObject: Phaser.GameObjects.GameObject,
      ) => {
        const gameScene = this.scene as GameScene;
        const grid = gameScene.comparisonGrid;

        if (grid) {
          const targetX = Math.round((this.x - grid.gridConfig.x) / grid.gridConfig.cellWidth) * grid.gridConfig.cellWidth + grid.gridConfig.x;
          const targetY = Math.round((this.y - grid.gridConfig.y) / grid.gridConfig.cellHeight) * grid.gridConfig.cellHeight + grid.gridConfig.y;

          this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            ease: "Power1",
            duration: 200,
            onComplete: () => {
              gameScene.updateGrid();
            },
          });
        }
      },
    );

    scene.add.existing(this);
  }
}
