tinker = window.tinker || {};
tinker.game = tinker.game || {};
game = tinker.game;

game.eventHandler = {}

tinker.game.config = {
    tiles:{
        rotate:true,
        swap: false
    }
}

game.state = {
    level:1,
    levelComplete:false
}

tinker.game.objects = {
    tiles:[]
}

game.eventHandler.onDragGrid = function(x,y,buttons) {
    console.log("game drag",x,y);
}

game.eventHandler.onClick = function(x,y,buttons) {
    console.log("game click",x,y)
}

game.eventHandler.onClickGrid = function(gridX,gridY,buttons) {
    const clickedIndex = tinker.game.objects.tiles.findIndex(img => img.x === gridX && img.y === gridY);
    if (clickedIndex !== -1) {
        if (tinker.game.config.tiles.rotate) {
            tinker.game.objects.tiles[clickedIndex].targetRotation += 90;
        console.log("setting rotation on",clickedIndex)
        }
    }
    console.log("game grid click - ",gridX,gridY)
}

tinker.game.shuffleTiles = function () {
    let tiles = tinker.game.objects.tiles;
    for (let i = 0; i < tiles.length; i++) {
        // Generate a random index to swap with
        const randomIndex = Math.floor(Math.random() * tiles.length);

        swapTilePositions(i, randomIndex);
    }
}


