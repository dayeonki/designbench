if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Get layer name and X and Y positions from arguments
    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {
            if (!isNaN(posX) && !isNaN(posY)) {
                for (var i = 0; i < layer.textFrames.length; i++) {
                    var textFrame = layer.textFrames[i];
                    textFrame.left = posX;
                    textFrame.top = posY;
                }
            } else {
                throw new Error("Invalid position provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to reposition the text.");
}