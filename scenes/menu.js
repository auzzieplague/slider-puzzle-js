class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('menu_background', './images/menu/menu.png');
        this.load.image('play', './images/menu/play_button.png');

        this.load.atlas('flares', './atlas/flares.png', './atlas/flares.json');

        this.load.audio('play_click','./sounds/play.mp3');
        this.load.audio('music','./sounds/chill.mp3');

    }


    setupEmitters (){

        this.startGameFlare = this.add.particles(515, 580, 'flares', {
            frame: 'blue',
            blendMode: 'ADD',
            lifespan: 1000,
            frequency: 16,
            scale: { start: 0.8, end: 0.1 },
            stopAfter: 32
        });

        this.startGameFlare.addEmitZone({
            type: 'edge',
            source: new Phaser.Geom.Circle(0, 0, 60),
            quantity: 32
        });

    }


    setupBloom(){
        const backgroundFX = this.background.postFX.addBloom(0xffffff, 1, 1, 0, 1.2);

        this.BGFXTween = this.tweens.add({
            targets: backgroundFX,
            blurStrength: 3,
            yoyo: true,
            duration: 200,
            paused: true,
            onComplete: () => {
                this.BGFXTween.restart();
                this.BGFXTween.pause();
            }
        });
    }
    bloom (on) {
        this.BGFXTween.restart();
        this.BGFXTween.play();
    }

    playButton(){
        let play = this.add.sprite(515, 821, 'play').setInteractive();

        // Input handling for icon1
        play.on('pointerdown', function (pointer) {
            // this.bloom();
            this.setupEmitters();
            // this.startGameFlare.start();
            this.sound.play('play_click');
            let deathCount = 0;
            const totalParticles = 32;
            // Listen for when the particles are all gone
            this.startGameFlare.onParticleDeath(() => {
                deathCount++;
                if (deathCount === totalParticles) {

                    this.startLevel();
                }
            });
        }, this);
    }

    startLevel() {
        this.sound.stopAll();
        this.scene.start('Level');
    }

    create() {
        this.sound.play('music');
        this.background = this.add.sprite(0, 0, 'menu_background').setOrigin(0, 0);
        this.setupBloom();
        this.playButton();

        const text = this.add.text(515, 580, gameState.level, { font: '64px Courier', fill: '#fff' }).setOrigin(0.5);

        this.bloom();
    }
}


