if (app.documents.length > 0) {
    var doc = app.activeDocument;
    
    var layerName = arguments[0];
    var fontSize = parseFloat(arguments[1]);

    if (layerName !== null && !isNaN(fontSize)) {
        var foundLayer = false;

        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];

            if (layer.name === layerName) {
                foundLayer = true;

                for (var j = 0; j < layer.textFrames.length; j++) {
                    var textFrame = layer.textFrames[j];
                    var text = textFrame.texts.item(0);

                    // Apply the new font size
                    text.pointSize = fontSize;
                }

                break;
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