if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var angle = parseFloat(arguments[1]);

    if (layerName) {
        
        if (layer && layer.pathItems.length > 0) {
            var angle = parseFloat(prompt("Enter the rotation angle (in degrees):", "90"));

            if (!isNaN(angle)) {
                rotatePathItem(layer.pathItems[0], angle);
            } else {
                throw new Error("Invalid angle entered.");
            }
        } else {
            throw new Error("No path items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Rotation cancelled.");
    }
} else {
    throw new Error("No active document to rotate the object in.");
}

function rotatePathItem(item, angle) {
    // Get the center of the item for rotation
    var bounds = item.geometricBounds;
    var centerX = (bounds[0] + bounds[2]) / 2;
    var centerY = (bounds[1] + bounds[3]) / 2;

    // Rotate the item around its center
    item.rotate(angle, undefined, centerX, centerY);
}