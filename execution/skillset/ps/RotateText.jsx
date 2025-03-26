if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt for layer name and rotation angle
    var layerName = arguments[0];
    var angle = parseFloat(arguments[1]);
    
    // Validate the angle
    if (isNaN(angle)) {
        throw new Error("Invalid angle entered. Please enter a numerical value.");
    } else if (layerName !== null) {
        var layers = doc.artLayers;
        var foundLayer = false;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.name === layerName && layer.kind === LayerKind.TEXT) {
                foundLayer = true;

                // Set the active layer
                doc.activeLayer = layer;

                // Rotate the text layer
                layer.rotate(angle);
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
    throw new Error("No open document. Please open a document to rotate the text layer.");
}