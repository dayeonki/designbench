if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var fontSize = parseFloat(arguments[1]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {

            if (fontSize !== null && !isNaN(fontSize)) {
                for (var i = 0; i < layer.textFrames.length; i++) {
                    var textFrame = layer.textFrames[i];
                    var textRange = textFrame.textRange;
                    textRange.characterAttributes.size = fontSize;
                }
            } else {
                throw new Error("Invalid font size provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to resize the text.");
}