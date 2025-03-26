if (app.documents.length > 0) {
    var doc = app.activeDocument;
    
    // Prompt for layer name and font
    var layerName = arguments[0];
    var fontName = arguments[1];

    if (layerName !== null && fontName !== null) {
        var layers = doc.artLayers;
        var foundLayer = false;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.name === layerName && layer.kind === LayerKind.TEXT) {
                var textItemRef = layer.textItem;
                textItemRef.font = fontName; // Apply the desired font
                foundLayer = true;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified layer name.");
        }
    } else {
        throw new Error("No layer name or font provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to apply the font.");
}