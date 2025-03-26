if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var width = parseFloat(arguments[1]);
    var height = parseFloat(arguments[2]);

    if (layerName) {
        var layer = doc.layers.getByName(layerName);

        if (layer && layer.placedItems.length > 0) {
            var placedItem = layer.placedItems[0];

            if (!isNaN(width) && !isNaN(height)) {
                resizeImageWithoutMoving(placedItem, width, height);
            } else {
                throw new Error("Invalid width or height entered.");
            }
        } else {
            throw new Error("No placed items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Resizing cancelled.");
    }
} else {
    throw new Error("No active document to resize the image in.");
}

function resizeImageWithoutMoving(item, width, height) {
    item.width = width;
    item.height = height;
}