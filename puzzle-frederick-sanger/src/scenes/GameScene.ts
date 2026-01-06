import Phaser from "phaser";
import {Button} from "../ui/Button";
import {TimerButton} from "../ui/TimerButton";
import {Dialog} from "../ui/Dialog";
import {DraggableGroup} from "../ui/DraggableGroup";
import {ComparisonGrid} from "../ui/ComparisonGrid";

export class GameScene extends Phaser.Scene {
  draggableGroups: DraggableGroup[] = [];
  public comparisonGrid!: ComparisonGrid;
  buttons: Button[] = [];
  timers: TimerButton[] = [];
  dialogs: Dialog[] = [];
  welcomeDialog!: Dialog;
  finalDialog!: Dialog;
  failureDialog!: Dialog;
  peptideSequenceLabels: string[] = [
    "Gly",
    "Ile",
    "Val",
    "Glu",
    "Gln",
    "Cys",
    "Cys",
    "Ala",
    "Ser",
    "Val",
    "Cys",
    "Ser",
    "Leu",
    "Tyr",
    "Gln",
    "Leu",
    "Glu",
    "Asn",
    "Tyr",
    "Cys",
    "Asn",
  ];

  constructor() {
    super({key: "GameScene"});
  }

  preload(): void {
    // No assets to load for now
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#d3d3d3");
    this.createGrid();
    this.createTimers();
    this.createButtons();
    this.createDialogs();
    this.welcomeDialog.show();
  }

  update(): void {
    // updateGrid() is now called on dragend events for DraggableGroup
  }

  private instantiateDraggableGroup(labels: string[]): DraggableGroup {
    const group = new DraggableGroup(
        this,
        Phaser.Math.Between(100, 600),
        Phaser.Math.Between(50, 120),
        labels,
    );
    this.draggableGroups.push(group);
    return group;
  }

  private createGrid(): void {
    const gridCellSize: number = 30;
    const gridNumRows: number = 10;
    const gridNumCols: number = this.peptideSequenceLabels.length;
    const gridWidth: number = gridNumCols * gridCellSize;
    const gridX: number =
        (this.sys.game.config.width as number) / 2 - gridWidth / 2;
    const gridY: number = 150;
    this.comparisonGrid = new ComparisonGrid(this, {
      x: gridX,
      y: gridY,
      cellWidth: gridCellSize,
      cellHeight: gridCellSize,
      numRows: gridNumRows,
      numCols: gridNumCols,
    });
  }

  public updateGrid(): void {
    if (!this.comparisonGrid) return;
    this.comparisonGrid.bottomRowDisplay.fill("");
    for (let col = 0; col < this.comparisonGrid.gridConfig.numCols; col++) {
      const foundLetters: string[] = [];
      for (let row = 0; row < this.comparisonGrid.gridConfig.numRows; row++) {
        const cellX: number =
            this.comparisonGrid.gridConfig.x + col * this.comparisonGrid.gridConfig.cellWidth;
        const cellY: number =
            this.comparisonGrid.gridConfig.y + row * this.comparisonGrid.gridConfig.cellHeight;
        const cellBounds: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
            cellX,
            cellY,
            this.comparisonGrid.gridConfig.cellWidth,
            this.comparisonGrid.gridConfig.cellHeight,
        );
        for (const group of this.draggableGroups) {
          group.list.forEach((boxContainer: Phaser.GameObjects.GameObject) => {
            // Change type to GameObject
            if (!(boxContainer instanceof Phaser.GameObjects.Container)) {
              return;
            }
            const boxBounds: Phaser.Geom.Rectangle = (
                boxContainer as Phaser.GameObjects.Container
            ).getBounds();
            const groupBoxBounds: Phaser.Geom.Rectangle = group.getBounds();
            const worldBoxX: number = groupBoxBounds.x + boxBounds.x - group.x;
            const worldBoxY: number = groupBoxBounds.y + boxBounds.y - group.y;
            const boxCenterX: number = worldBoxX + boxBounds.width / 2;
            const boxCenterY: number = worldBoxY + boxBounds.height / 2;
            if (
                Phaser.Geom.Rectangle.Contains(cellBounds, boxCenterX, boxCenterY)
            ) {
              const letter = boxContainer.getData("letter") as string;
              foundLetters.push(letter);
            }
          });
        }
      }
      if (foundLetters.length > 0) {
        const firstLetter: string = foundLetters[0];
        const allSame: boolean = foundLetters.every(
            (letter) => letter === firstLetter,
        );
        if (allSame) {
          this.comparisonGrid.bottomRowDisplay[col] = firstLetter;
        }
      }
    }
    for (let i = 0; i < this.comparisonGrid.bottomRowTexts.length; i++) {
      this.comparisonGrid.bottomRowTexts[i].setText(
          this.comparisonGrid.bottomRowDisplay[i],
      );
    }
  }

  private createTimers(): void {
    const button_width: number = 120;
    const button_height: number = 30;
    const button_spacing: number = 10;
    const timerConfigs = [
      {label: "Štiepenie 1", color: 0x00ffff, seriesIndex: 0, duration: 3000},
      {label: "Štiepenie 2", color: 0xffc0cb, seriesIndex: 1, duration: 3000},
      {label: "Štiepenie 3", color: 0xffff00, seriesIndex: 2, duration: 3000},
    ];
    const numButtons = timerConfigs.length;
    const totalButtonsWidth =
        numButtons * button_width + (numButtons - 1) * button_spacing;
    const leftMostButtonCenterX =
        (this.sys.game.config.width as number) / 2 -
        totalButtonsWidth / 2 +
        button_width / 2;
    const button_y: number = 30; // Increased offset from top
    const groupSeries: string[][][] = [
      [
        ["Gly", "Ile", "Val", "Glu", "Gln"],
        ["Cys", "Cys", "Ala"],
        ["Ser", "Val", "Cys", "Ser", "Leu", "Tyr", "Gln"],
        ["Asn", "Tyr", "Cys", "Asn"],
      ], // Corrected "An" to "Asn"
      [
        ["Val", "Glu", "Gln", "Cys", "Cys", "Ala", "Ser", "Val"],
        ["Ala", "Ser", "Val", "Cys", "Ser", "Leu", "Tyr"],
      ],
      [
        ["Gly", "Ile", "Val", "Glu", "Gln", "Cys"],
        ["Cys", "Cys", "Ala", "Ser", "Val", "Cys"],
        ["Cys", "Ser", "Leu", "Tyr", "Gln", "Leu"],
        ["Gln", "Leu", "Glu", "Asn", "Tyr", "Cys", "Asn"],
      ],
    ];
    timerConfigs.forEach((config, index) => {
      const x: number =
          leftMostButtonCenterX + index * (button_width + button_spacing);
      const timerButton = new TimerButton(
          this,
          x,
          button_y,
          config.label,
          button_width,
          button_height,
          config.color,
          config.duration,
          () => {
            groupSeries[config.seriesIndex].forEach((labels: string[]) =>
                this.instantiateDraggableGroup(labels),
            );
          },
      );
      this.timers.push(timerButton);
    });
  }

  private createButtons(): void {
    if (!this.comparisonGrid) return;
    const grid: ComparisonGrid = this.comparisonGrid;
    const evaluateButton = new Button(
        this,
        grid.gridConfig.x + (grid.gridConfig.numCols * grid.gridConfig.cellWidth) / 2,
        grid.gridConfig.y + (grid.gridConfig.numRows + 1) * grid.gridConfig.cellHeight + 20,
        "Skontroluj sekvenciu",
        200,
        30,
        0x90ee90,
        () => {
          const isSolved: boolean = this.peptideSequenceLabels.every(
              (label, index) =>
                  label === this.comparisonGrid?.bottomRowDisplay[index],
          );
          if (isSolved) {
            this.scene.start("WinScene");
          } else {
            this.failureDialog.show();
          }
        },
        2, // borderThickness
        0x000000, // borderColor
    );
    this.buttons.push(evaluateButton);
    this.add
        .text(
            (this.sys.game.config.width as number) / 2,
            560,
            "Ak si myslíš, že máš poskladanú celú sekvenciu správne, klikni na tlačidlo 'Skontroluj sekvenciu'.",
            {
              fontSize: "13px",
              color: "#000",
            },
        )
        .setOrigin(0.5);
  }

  private createDialogs(): void {
    this.welcomeDialog = new Dialog(
        this,
        "Tvojou úlohou je odhaliť správnu a presnú aminokyselinovú sekvenciu „Sangerovho prvého proteínu“.\n1. Klikni Štiepenie 1. Objavia sa fragmenty proteínu, ktoré treba poskladať. Len ako?\n2. Klikni Štiepenie 2. a neskôr 3. Objavia sa fragmenty toho istého proteínu, ale naštiepené inak.\n3. Na základe prekryvov zo štiepení 1-3 nájdi správnu sekvenciu.\n4. Jednotlivé sekvencie posúvaj do štvorčekovej siete.\nMalá pomôcka: Sekvencia nášho proteínu začína aminokyselinou glycín (Gly). Veľa šťastia!",
        600,
        240,
    );
    this.finalDialog = new Dialog(
        this,
        "Gratulujeme!\nZhoda s peptidovou sekvenciou!",
        300,
        100,
    );
    this.failureDialog = new Dialog(
        this,
        "Ojoj! Sekvencia sa zatiaľ nezhoduje. Skúste to znova!",
        300,
        100,
    );
  }
}
