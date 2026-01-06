import Phaser from "phaser";

export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: "WinScene" });
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#2c3e50"); // Deep blue background

    // "Fantastické, gratulujeme!"
    this.add
      .text(
        (this.sys.game.config.width as number) / 2,
        60,
        "Fantastické, gratulujeme!",
        {
          fontSize: "24px",
          color: "#f1c40f", // Triumphant yellow
        },
      )
      .setOrigin(0.5);

    // Long explanation text
    const longText =
      "Práve sa ti podarilo úspešne určiť aminokyselinovú sekvenciu hormónu Inzulínu - presnejšie jeho A reťazca, tvoreného z 21 aminokyselín. Inzulín (hovädzí) bol prvým proteínom s objasnenou primárnou sekvenciou. Zaujímavosťou je, že ľudský inzulín sa od toho hovädzieho líši celkovo iba v troch aminokyselinách z celkových 51 pre oba reťazce. A vedel si, že Frederick Sanger je jedným z dvoch laureátov v histórii, ktorý získal Nobelovu cenu za chémiu dvakrát. Druhou Nobelovou cenou za chémiu bol v roku 1980 ocenený za vývoj metódy na sekvenovanie DNA, pričom základy pre túto prelomovú techniku položil práve jeho skorší výskum aminokyselinových sekvencií, vrátane tej inzulínovej.";
    this.add
      .text(40, 120, longText, {
        // Position 40, 120
        fontSize: "16px",
        color: "#ffffff",
        wordWrap: { width: 720 }, // Max width 720, height 460 implies this width.
      })
      .setOrigin(0); // setOrigin(0) for LEFT, TOP

    // "Click to play again" button - removed interactivity from here
    this.add
      .text(
        (this.sys.game.config.width as number) / 2,
        (this.sys.game.config.height as number) / 2 + 200,
        "Kliknite pre hru znovu",
        {
          // Adjusted y position
          fontSize: "18px",
          color: "#3498db", // Light blue
        },
      )
      .setOrigin(0.5);

    // Make the entire screen clickable
    const screenZone = this.add
      .zone(
        0,
        0,
        this.sys.game.config.width as number,
        this.sys.game.config.height as number,
      )
      .setOrigin(0);
    screenZone.setInteractive();
    screenZone.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
