if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (isNaN(posX) || isNaN(posY)) {
        throw new Error("Invalid position values entered. Please enter valid numbers for X and Y positions.");
    } else if (layerName !== null) {
        var layers = doc.artLayers;
        var foundLayer = false;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.name === layerName && layer.kind === LayerKind.TEXT) {
                foundLayer = true;

                // Reposition the text layer
                var textItemRef = layer.textItem;
                textItemRef.position = [posX, posY];
                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to reposition the text layer.");
}