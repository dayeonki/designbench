if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var opacity = parseFloat(arguments[1]);
    
    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {

            if (opacity !== null && !isNaN(opacity)) {

                if (opacity >= 0 && opacity <= 100) {
                    for (var i = 0; i < layer.textFrames.length; i++) {
                        var textFrame = layer.textFrames[i];
                        textFrame.opacity = opacity;
                    }
                } else {
                    throw new Error("Invalid opacity value provided. It must be between 0 and 100.");
                }
            } else {
                throw new Error("Invalid opacity value provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the text opacity.");
}