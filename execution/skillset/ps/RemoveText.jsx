if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];

    if (layerName) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            removeAllTextLayers(layer);
        } else {
            throw new Error("No text layers found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Removal cancelled.");
    }
} else {
    throw new Error("No active document to remove the text from.");
}

function removeAllTextLayers(layer) {
    if (layer.kind === LayerKind.TEXT) {
        layer.remove();
    } else {
        throw new Error("The specified layer is not a text layer.");
    }
}