if (app.documents.length > 0) {
    var doc = app.activeDocument;
    
    var layerName = arguments[0];
    var fontSize = parseFloat(arguments[1]);
    
    if (layerName !== null && !isNaN(fontSize)) {
        var layers = doc.artLayers;
        var foundLayer = false;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.name === layerName && layer.kind === LayerKind.TEXT) {
                var textItemRef = layer.textItem;
                textItemRef.size = fontSize; // Apply the new font size
                foundLayer = true;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified layer name.");
        }
    } else {
        throw new Error("No layer name or invalid font size provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to resize the text.");
}