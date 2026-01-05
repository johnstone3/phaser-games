import { Button } from './Button';
import Phaser from 'phaser';

export class TimerButton extends Button {
    private originalText: string;
    private duration: number;
    private originalCallback: Function;
    private timerEvent: Phaser.Time.TimerEvent | null = null;
    
    // Child text object is at index 1 in the container list
    private buttonText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, width: number, height: number, color: number, duration: number, callback: Function) {
        // The callback passed to the parent Button becomes this.startTimer
        super(scene, x, y, text, width, height, color, () => {
            if (!this.timerEvent || this.timerEvent.getRemaining() === 0) {
                this.startTimer();
            }
        });

        this.originalText = text;
        this.duration = duration;
        this.originalCallback = callback;
        
        // After super() is called, the children are added to this container.
        // The text object is the second child in the list.
        this.buttonText = this.list[1] as Phaser.GameObjects.Text;
    }

    private startTimer(): void {
        // Disable the button via the parent's setInteractive
        this.disableInteractive();

        let remainingTime = this.duration / 1000;
        this.buttonText.setText(remainingTime.toString());

        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            // Run for remainingTime seconds
            repeat: remainingTime - 1,
            callback: () => {
                remainingTime--;
                this.buttonText.setText(remainingTime.toString());
                if (remainingTime <= 0) {
                    this.originalCallback();
                    this.destroy();
                }
            }
        });
    }
}