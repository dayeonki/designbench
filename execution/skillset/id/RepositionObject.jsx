if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt the user for the layer name
    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.itemByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer && layer.isValid) {
            if (!isNaN(posX) && !isNaN(posY)) {
                repositionLayer(layer, posX, posY);
            } else {
                throw new Error("Invalid position entered.");
            }
        } else {
            throw new Error("No valid layer found or layer is empty. Operation cancelled.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to reposition the layer.");
}

function repositionLayer(layer, posX, posY) {
    // Loop through page items in the specified layer and reposition them
    var pageItems = layer.pageItems;
    for (var i = 0; i < pageItems.length; i++) {
        var item = pageItems[i];

        // Get current position
        var currentPos = item.geometricBounds;
        var currentX = currentPos[1]; // X position
        var currentY = currentPos[0]; // Y position

        // Calculate offset
        var offsetX = posX - currentX;
        var offsetY = posY - currentY;

        // Reposition item
        item.move([offsetX, offsetY]);
    }
}