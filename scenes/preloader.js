class Preloader extends Phaser.Scene {

    constructor() {
        super('Preloader');
    }

    preload() {
        // Create loading bar graphics
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 520, 50);

        // Display loading text
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Update the progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 500 * value, 30);
        });

        // Remove the progress bar when complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('MainMenu'); // Replace 'MainMenu' with the key of your main game scene
        });

        for (let i=0;i<50;i++){
            this.load.image(`test${i}`,"./images/splash.png")
            console.log("loading ", i);
        }
    }
        // create() {
        // let background = this.add.sprite(0, 0, 'preload_background').setOrigin(0, 0);
        //
        // this.sound.play('intro').repeat();
        //
        // // will be progress bar
        // this.time.delayedCall(1, () => {
        //     this.scene.start('MainMenu');
        // });
    // }
}