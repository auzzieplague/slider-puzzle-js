console.log('image');
tinker = window.tinker || {};
tinker.image = {};

tinker.image.initialiseImagesFromAtlas = function(imagePath, gridSize, images = {}, onComplete = null) {
    const largeImage = new Image();

    console.log('init from atlas');
    largeImage.onload = () => {
        const sliceWidth = largeImage.width / gridSize;
        const sliceHeight = largeImage.height / gridSize;
        const slicedImages = tinker.image.sliceImage(largeImage, gridSize, images);

        // Clear the original array and push new images
        images.length = 0; // Clear existing entries
        slicedImages.forEach(image => images.push(image)); // Populate with new images

        if (onComplete) {
            onComplete(slicedImages);
        }
    };

    largeImage.src = imagePath; // Update with the actual path
}

tinker.image.sliceImage= function (largeImage, gridSize, images) {
    const sliceWidth = largeImage.width / gridSize;
    const sliceHeight = largeImage.height / gridSize;
    let index = 0;
    

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            images[index] = {
                img: tinker.image.slicePart(largeImage, x * sliceWidth, y * sliceHeight, sliceWidth, sliceHeight),
                x: x,
                y: y,
                targetX: x,
                targetY: y,
                progress: 1,
                scale: 1, // Normal scale
                targetScale: 1, // Target scale
                scaleProgress: 1, // Progress of scale animation
                rotation: 0, // Initial rotation
                targetRotation: 0 // Target rotation
            };
            index++;
        }
    }
    return images;
}

tinker.image.slicePart = function(image, x, y, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Draw part of the large image on this canvas
    context.drawImage(image, x, y, width, height, 0, 0, width, height);

    // Create a new image from this canvas
    const slicedImage = new Image();
    slicedImage.src = canvas.toDataURL();

    return slicedImage;
}

tinker.image.getImageFromCanvas = function (x, y, imageList) {
    return  imageList.findIndex(img => img.x === x && img.y === y);
}
