console.log('main');
tinker = window.tinker || {};
tinker.engine = tinker.engine || {};

const ctx = tinker.game.canvasContext;
canvas = tinker.game.canvas;

const gridSize = 4;
const cellSize = canvas.width / gridSize;
let images = [];
let startDrag = null;

tinker.engine.start = function () {
    console.log("starting");
    this.init();
    requestAnimationFrame(this.loop);
}

tinker.engine.loop = function() {
    const loopFunction = () => {
        if (!tinker.game.state.levelComplete) {
            tinker.engine.update();
            tinker.engine.render();
            requestAnimationFrame(loopFunction); // Request the next frame
        }
    };

    requestAnimationFrame(loopFunction); // Start the loop
};

tinker.engine.update = function () {
    animateTileMovements();
}


tinker.engine.render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tinker.game.objects.tiles.forEach(tile => {
        ctx.save(); // Save current state
        ctx.translate(tile.x * cellSize + cellSize / 2, tile.y * cellSize + cellSize / 2);
        ctx.scale(tile.scale, tile.scale);
        ctx.rotate(tile.rotation * Math.PI / 180);
        ctx.drawImage(tile.img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
        ctx.restore(); // Restore original state
    });
}


tinker.engine.init = function () {
    console.log("initialising");

    // images = tinker.image.initialiseImages();
    tinker.image.initialiseImagesFromAtlas("./images/level0.png",gridSize,  tinker.game.objects.tiles, function (){
        console.log("running onComplete");
        tinker.game.shuffleTiles();
        // drawGrid();
    });

}

function swapTilePositions(index1, index2) {
    if (index1 === index2) return; // Skip if indices are the same
    let images = tinker.game.objects.tiles;
    // Swap the x and y positions
    [images[index1].x, images[index2].x] = [images[index2].x, images[index1].x];
    [images[index1].y, images[index2].y] = [images[index2].y, images[index1].y];

    // If using target positions for animation, swap these too
    [images[index1].targetX, images[index2].targetX] = [images[index2].targetX, images[index1].targetX];
    [images[index1].targetY, images[index2].targetY] = [images[index2].targetY, images[index1].targetY];
}



// tinker.engine.start();