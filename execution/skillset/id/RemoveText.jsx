if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];

    if (layerName) {
        var layer;
        try {
            layer = doc.layers.item(layerName);
            var layerNameCheck = layer.name; // This will throw an error if the layer doesn't exist
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer && layer.textFrames.length > 0) {
            removeAllTextFrames(layer.textFrames);
        } else {
            throw new Error("No text frames found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Removal cancelled.");
    }
} else {
    throw new Error("No active document to remove the text from.");
}

function removeAllTextFrames(textFrames) {
    while (textFrames.length > 0) {
        textFrames[0].remove();
    }
}