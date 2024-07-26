
let canvasWidth = 1024;
let aspectRatio = 1.75
let canvasHeight = aspectRatio * canvasWidth;

// game

var config = {
    type: Phaser.AUTO,
    width: canvasWidth, // Your game's desired width
    height: canvasHeight, // Your game's desired height
    // scene: [Splash, Preloader, MainMenu, Level, LevelSelect],
    // scene: [MainMenu, Level,Preloader, LevelSelect],
    scene: [MainMenu, Preloader, Level, LevelSelect],
    // scene: [Level, LevelSelect],
    scale: {
        mode: Phaser.Scale.FIT, // Fit to window
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game canvas
        parent: 'canvasContainer', // ID of the DOM element to add the canvas to
        width: canvasWidth,
        height: canvasHeight
    }
};

// var game = new Phaser.Game(config);
var game = new Phaser.Game(config);

var gameState = {
    game: {
        config:config,
        instance:game
    },
    level: 1,
    score:0,
    lives:3,
    money:50,
    difficulty:1,
    sound:1,
    currentLevel: {
        config: {},
    }
};


game.sound.onBlur = () => {}; // Empty function to prevent pausing
game.sound.onFocus = () => {}; // Empty function to prevent unpausing