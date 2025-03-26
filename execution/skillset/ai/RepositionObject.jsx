if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (layerName) {
        var layer = null;
        for (var i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i].name === layerName) {
                layer = doc.layers[i];
                break;
            }
        }

        if (layer && layer.pageItems.length > 0) {

            if (!isNaN(posX) && !isNaN(posY)) {
                repositionLayer(layer, posX, posY);
                throw new Error("Layer repositioned successfully.");
            } else {
                throw new Error("Invalid position entered.");
            }
        } else {
            throw new Error("No items found in the layer with the name " + layerName);
        }
    } else {
        throw new Error("No layer name entered. Repositioning cancelled.");
    }
} else {
    throw new Error("No active document to reposition the layer in.");
}

function repositionLayer(layer, posX, posY) {
    for (var i = 0; i < layer.pageItems.length; i++) {
        var item = layer.pageItems[i];

        var currentPos = item.position;
        var currentX = currentPos[0];
        var currentY = currentPos[1];

        var offsetX = posX - currentX;
        var offsetY = posY - currentY;

        item.position = [posX, posY];
    }
}