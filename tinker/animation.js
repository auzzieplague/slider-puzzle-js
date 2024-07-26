console.log('animation');
tinker = window.tinker || {};

function getTargetCellCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    // Find the image that is animating towards this grid position
    const foundImage = images.find(img => img.targetX === gridX && img.targetY === gridY);
    return foundImage ? { x: foundImage.targetX, y: foundImage.targetY } : null;
}

function swapImages(start, end) {

    // Check if the positions are neighbors (either horizontally or vertically)
    const isNeighbor = (Math.abs(start.x - end.x) === 1 && start.y === end.y) ||
        (Math.abs(start.y - end.y) === 1 && start.x === end.x);

    if (!isNeighbor) {
        return; // Do not swap if they are not neighbors
    }

    let tiles = tinker.game.objects.tiles;

    const startIndex = tiles.findIndex(img => img.targetX === start.x && img.targetY === start.y);
    const endIndex = tiles.findIndex(img => img.targetX === end.x && img.targetY === end.y);

    if (startIndex === -1 || endIndex === -1) {
        return; // Do nothing if no matching tiles are found
    }

    // Swap target positions
    [tiles[startIndex].targetX, tiles[endIndex].targetX] = [tiles[endIndex].targetX, tiles[startIndex].targetX];
    [tiles[startIndex].targetY, tiles[endIndex].targetY] = [tiles[endIndex].targetY, tiles[startIndex].targetY];

    // Reset progress for animation
    tiles[startIndex].progress = 0;
    tiles[endIndex].progress = 0;

    // Reset scale progress for animation
    tiles[startIndex].scaleProgress = 0;
    tiles[endIndex].scaleProgress = 0;
}

function animateTileMovements() {


    tinker.game.objects.tiles.forEach(tiles => {
        if (tiles.progress < 1 || tiles.scaleProgress < 1) {

            tiles.progress += 0.05;
            tiles.scaleProgress += 0.05;

            if (tiles.progress > 1) tiles.progress = 1;
            if (tiles.scaleProgress > 1) tiles.scaleProgress = 1;

            // Update position
            tiles.x = lerp(tiles.x, tiles.targetX, tiles.progress);
            tiles.y = lerp(tiles.y, tiles.targetY, tiles.progress);

            // Update scale - scale up then down
            tiles.scale = lerpScale(tiles.scaleProgress);
        }

        if (tiles.rotation !== tiles.targetRotation) {
            tiles.rotation += (tiles.targetRotation - tiles.rotation) * 0.1; // Adjust this value for speed

            if (Math.abs(tiles.targetRotation - tiles.rotation) < 1) {
                tiles.rotation = tiles.targetRotation; // Snap to target rotation
            }
        }
    });

}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}


function lerpScale(progress) {
    if (progress < 0.5) {
        // Scale up
        return lerp(1, 1.2, progress * 2); // Scale up to 1.2
    } else {
        // Scale down
        return lerp(1.2, 1, (progress - 0.5) * 2); // Then scale down back to 1
    }
}