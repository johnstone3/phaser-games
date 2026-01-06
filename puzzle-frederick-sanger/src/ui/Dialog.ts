import Phaser from "phaser";

export class Dialog extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    text: string,
    width: number,
    height: number,
  ) {
    super(scene, 0, 0);
    this.setDepth(100);

    // Background overlay
    const bgOverlay: Phaser.GameObjects.Graphics = scene.add.graphics();
    bgOverlay.fillStyle(0x000000, 0.4);
    bgOverlay.fillRect(
      0,
      0,
      scene.sys.game.config.width as number,
      scene.sys.game.config.height as number,
    );
    this.add(bgOverlay);

    const dialogBoxX: number = (scene.sys.game.config.width as number) / 2;
    const dialogBoxY: number = (scene.sys.game.config.height as number) / 2;

    const bg: Phaser.GameObjects.Graphics = scene.add.graphics();
    bg.fillStyle(0xfaf0e4, 1);
    bg.lineStyle(1, 0x000000);
    bg.fillRect(dialogBoxX - width / 2, dialogBoxY - height / 2, width, height);
    bg.strokeRect(
      dialogBoxX - width / 2,
      dialogBoxY - height / 2,
      width,
      height,
    );
    this.add(bg);

    const content: Phaser.GameObjects.Text = scene.add
      .text(dialogBoxX, dialogBoxY, text, {
        fontSize: "15px",
        color: "#000",
        wordWrap: { width: width - 20 },
        align: "center",
      })
      .setOrigin(0.5);
    this.add(content);

    const closeButtonSize: number = 20;
    const closeButtonX: number = dialogBoxX + width / 2 - closeButtonSize - 5;
    const closeButtonY: number = dialogBoxY - height / 2 + 5;

    const closeButtonGraphics: Phaser.GameObjects.Graphics =
      scene.add.graphics();
    closeButtonGraphics.fillStyle(0xc83232, 1);
    closeButtonGraphics.fillRect(
      closeButtonX,
      closeButtonY,
      closeButtonSize,
      closeButtonSize,
    );
    const closeText: Phaser.GameObjects.Text = scene.add
      .text(
        closeButtonX + closeButtonSize / 2,
        closeButtonY + closeButtonSize / 2,
        "X",
        { fontSize: "16px", color: "#fff" },
      )
      .setOrigin(0.5);
    this.add(closeButtonGraphics);
    this.add(closeText);

    const closeButtonHitArea: Phaser.GameObjects.Zone = scene.add
      .zone(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize)
      .setOrigin(0);
    closeButtonHitArea.setInteractive();
    closeButtonHitArea.on("pointerdown", () => this.hide());
    this.add(closeButtonHitArea);

    this.visible = false;
    scene.add.existing(this);
  }

  show(): void {
    this.visible = true;
    this.scene.children.bringToTop(this);
  }

  hide(): void {
    this.visible = false;
  }
}
