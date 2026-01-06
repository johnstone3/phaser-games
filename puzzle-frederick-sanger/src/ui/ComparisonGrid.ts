import Phaser from "phaser";

interface ComparisonGridConfig {
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  numRows: number;
  numCols: number;
}

export class ComparisonGrid extends Phaser.GameObjects.Container {
  public bottomRowDisplay: string[];
  public bottomRowTexts: Phaser.GameObjects.Text[];
  public gridConfig: ComparisonGridConfig;

  constructor(scene: Phaser.Scene, config: ComparisonGridConfig) {
    super(scene, config.x, config.y);

    this.gridConfig = config;
    this.bottomRowDisplay = new Array<string>(config.numCols).fill("");
    this.bottomRowTexts = [];

    this.createGridGraphics();

    scene.add.existing(this);
  }

  private createGridGraphics(): void {
    const { cellWidth, cellHeight, numRows, numCols } = this.gridConfig;
    const gridGraphics: Phaser.GameObjects.Graphics = this.scene.add.graphics();
    this.add(gridGraphics); // Add graphics to the container first

    gridGraphics.lineStyle(1, 0x999999); // Darker grid line color

    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        gridGraphics.strokeRect(
          col * cellWidth,
          row * cellHeight,
          cellWidth,
          cellHeight,
        );
      }

      const bottomCellX: number = col * cellWidth;
      const bottomCellY: number = numRows * cellHeight;

      gridGraphics.lineStyle(2, 0x000000); // Thicker black border for bottom row
      gridGraphics.fillStyle(0xffff99, 1); // Light yellow fill for bottom row
      gridGraphics.fillRect(bottomCellX, bottomCellY, cellWidth, cellHeight);
      gridGraphics.strokeRect(bottomCellX, bottomCellY, cellWidth, cellHeight);

      gridGraphics.lineStyle(1, 0x999999); // Revert to original thin grey line style for regular grid lines

      const text: Phaser.GameObjects.Text = this.scene.add
        .text(bottomCellX + cellWidth / 2, bottomCellY + cellHeight / 2, "", {
          fontSize: "12px",
          color: "#000",
        })
        .setOrigin(0.5);

      this.bottomRowTexts.push(text);
      this.add(text); // Add text to the container
    }
  }
}
