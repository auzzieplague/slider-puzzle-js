
class MenuBar extends Phaser.Scene {

    constructor() {
        super('MenuBar');
    }

    preload() {
        // Preload your icons here
        this.load.image('background', './images/image0.png');
    }

    create() {
        let background = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    }
}