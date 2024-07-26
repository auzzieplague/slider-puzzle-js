
class Splash extends Phaser.Scene {

    constructor() {
        super('Splash');
    }

    preload() {
        // Preload your icons here
        this.load.image('background', './images/splash.png');
        this.load.audio('gears',['./sounds/gears.mp3']);
    }

    create() {
        let background = this.add.sprite(0, 0, 'background').setOrigin(0, 0);

        // Play sound (assuming you have already loaded a sound file named 'exampleSound' in preload)
        // this.sound.play('gears');

        // Timeout for 2 seconds and continue on to Preloader scene
        this.time.delayedCall(2000, () => {
            this.scene.start('Preloader');
        });
    }
}