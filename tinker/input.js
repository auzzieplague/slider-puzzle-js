console.log('input');
tinker = window.tinker || {};
canvas = tinker.game.canvas;

canvas.addEventListener('mousedown', (e) => {
    startDrag = getTargetCellCoordinates(e);
});

canvas.addEventListener('mouseup', (e) => {
    if (!startDrag) return;
    const endDrag = getTargetCellCoordinates(e);

    // run assigned items touch event
    swapImages(startDrag, endDrag);
    startDrag = null;
});

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchend', handleTouchEnd, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(e) {
    e.preventDefault();
    startDrag = getCellCoordinatesFromTouch(e);
    touchStartPos = { x: startDrag.x, y: startDrag.y };
}

function handleTouchEnd(e) {
    e.preventDefault();
    const endDrag = getCellCoordinatesFromTouch(e);

    // Check if the touch action is a tap (i.e., start and end positions are the same)
    if (startDrag && touchStartPos.x === endDrag.x && touchStartPos.y === endDrag.y) {
        // Handle tap'
        tinker.game.eventHandler.onClickGrid(startDrag.x, startDrag.y);
        // handleCanvasClick(startDrag.x, startDrag.y);
    } else if (startDrag) {
        // Handle swipe
        swapImages(startDrag, endDrag);
    }

    startDrag = null;
    touchStartPos = null;
}

function handleTouchMove(e) {
    e.preventDefault(); // Optional, depending on your use case
    // Implement if you need to track movement (e.g., for live dragging)
}

function getCellCoordinatesFromTouch(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) };
}


function handleCanvasClick(x, y) {
    const clickedIndex = images.findIndex(img => img.x === x && img.y === y);
    // game.eventHandler.onClickGrid(x,y);
    if (clickedIndex !== -1) {
    //     if (tinker.game.config.tiles.rotate) {
            images[clickedIndex].targetRotation += 90;
        // }
    }
}
