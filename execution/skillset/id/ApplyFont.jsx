if (app.documents.length > 0) {
    var doc = app.activeDocument;
    
    // Prompt for layer name and font
    var layerName = arguments[0];
    var fontName = arguments[1];

    if (layerName !== null && fontName !== null) {
        var foundLayer = false;
        var fontApplied = true;

        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];

            if (layer.name === layerName) {
                foundLayer = true;

                for (var j = 0; j < layer.textFrames.length; j++) {
                    var textFrame = layer.textFrames[j];
                    var text = textFrame.texts.item(0);

                    // Apply the desired font
                    try {
                        text.appliedFont = fontName;
                    } catch (e) {
                        fontApplied = false;
                    }
                }

                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified layer name.");
        } else if (!fontApplied) {
            throw new Error("The specified font was not found. Please ensure the font name is correct.");
        }
    } else {
        throw new Error("No layer name or font provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to apply the font.");
}