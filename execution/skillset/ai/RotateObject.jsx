if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var angle = parseFloat(arguments[1]);

    if (layerName) {
        var layer = null;
        for (var i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i].name === layerName) {
                layer = doc.layers[i];
                break;
            }
        }

        if (layer && layer.pageItems.length > 0) {

            if (!isNaN(angle)) {
                rotateLayer(layer, angle);
            } else {
                throw new Error("Invalid angle entered.");
            }
        } else {
            throw new Error("No items found in the layer with the name " + layerName);
        }
    } else {
        throw new Error("No layer name entered. Rotation cancelled.");
    }
} else {
    throw new Error("No active document to rotate objects in.");
}

function rotateLayer(layer, angle) {
    for (var i = 0; i < layer.pageItems.length; i++) {
        var item = layer.pageItems[i];
        item.rotate(angle);
    }
}