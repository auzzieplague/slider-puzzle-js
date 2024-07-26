class LevelSelect extends Phaser.Scene {

    constructor() {
        super('LevelSelect');
    }

    preload() {
        // Preload your icons here
        this.load.image('background', './images/level0.png');
    }

    create() {
        let background = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    }
}