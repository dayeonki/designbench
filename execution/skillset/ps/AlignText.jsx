if (app.documents.length > 0) {
    var doc = app.activeDocument;
    
    var layerName = arguments[0];
    var alignment = arguments[1].toLowerCase();

    if (alignment !== "left" && alignment !== "center" && alignment !== "right") {
        throw new Error("Invalid alignment option. Please enter 'left', 'center', or 'right'.");
    } else if (layerName !== null) {
        var layers = doc.artLayers;
        var foundLayer = false;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.name === layerName && layer.kind === LayerKind.TEXT) {
                var textItemRef = layer.textItem;

                // Apply alignment based on user input
                if (alignment === "left") {
                    textItemRef.justification = Justification.LEFT;
                } else if (alignment === "center") {
                    textItemRef.justification = Justification.CENTER;
                } else if (alignment === "right") {
                    textItemRef.justification = Justification.RIGHT;
                }
                foundLayer = true;
                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified layer name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to align the text.");
}