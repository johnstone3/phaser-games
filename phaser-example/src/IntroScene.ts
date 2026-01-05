import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#2c3e50'); // Deep blue background

        // Title text
        this.add.text(this.sys.game.config.width as number / 2, 40, 'Nobelova cena za chémiu 1958 - Frederick Sanger', {
            fontSize: '26px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Main introductory text
        const introText = "V roku 1958 získal Nobelovu cenu za chémiu britský biochemik Frederick Sanger, ktorému sa ako prvému podarilo stanoviť kompletnú a presnú aminokyselinovú sekvenciu proteínu (o ktorý presne išlo sa dozvieš na konci, ak sa ju podarí úspešne dešifrovať aj tebe). Sanger ukázal, že bielkoviny(proteíny) majú jednoznačné, presne definované poradie aminokyselín, čo odštartovalo modernú biochemickú a molekulárno-biologickú éru. Jeho práca zahŕčala postupné štiepenie proteínu rôznymi spôsobmi (najmä trypsínom a chymotrypsínom), porovnávanie prekryvov medzi fragmentmi a skladanie kompletného reťazca z mnohých čiastkových častí. Ako to mohlo vyzerať si poď vyskúšať aj ty. ";
        this.add.text(20, 125, introText, { // Position 20, 125
            fontSize: '20px',
            fill: '#ffffff',
            wordWrap: { width: 760 } // Max width 760
        }).setOrigin(0); // setOrigin(0) for LEFT, TOP

        // "KLIKNITE PRE POKRAČOVANIE..." text - removed interactivity from here
        this.add.text(this.sys.game.config.width as number / 2, 580, 'KLIKNITE PRE POKRAČOVANIE...', {
            fontSize: '30px',
            fill: '#f1c40f' // Vibrant yellow text
        }).setOrigin(0.5);

        // Make the entire screen clickable
        const screenZone = this.add.zone(0, 0, this.sys.game.config.width as number, this.sys.game.config.height as number).setOrigin(0);
        screenZone.setInteractive();
        screenZone.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}