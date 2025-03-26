if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var angle = parseFloat(arguments[1]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {

            if (angle !== null && !isNaN(angle)) {

                for (var i = 0; i < layer.textFrames.length; i++) {
                    var textFrame = layer.textFrames[i];
                    textFrame.rotate(angle);
                }
            } else {
                throw new Error("Invalid angle value provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to rotate the text.");
}