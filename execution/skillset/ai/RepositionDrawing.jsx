if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (layerName) {
        var layer = doc.layers.getByName(layerName);

        if (layer && layer.pathItems.length > 0) {
            if (!isNaN(posX) && !isNaN(posY)) {
                repositionPathItem(layer.pathItems[0], posX, posY);
            } else {
                throw new Error("Invalid X or Y position entered.");
            }
        } else {
            throw new Error("No path items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Repositioning cancelled.");
    }
} else {
    throw new Error("No active document to reposition the object in.");
}

function repositionPathItem(item, posX, posY) {
    // Calculate the current position
    var bounds = item.geometricBounds;
    var currentX = (bounds[0] + bounds[2]) / 2;
    var currentY = (bounds[1] + bounds[3]) / 2;

    // Calculate the translation amounts
    var deltaX = posX - currentX;
    var deltaY = posY - currentY;

    // Move the item to the new position
    item.left += deltaX;
    item.top -= deltaY;
}