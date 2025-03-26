if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {
            if (layer.textFrames.length > 0) {
                var fontStyles = {};
                for (var i = 0; i < layer.textFrames.length; i++) {
                    var textFrame = layer.textFrames[i];
                    var textRange = textFrame.textRange;
                    var font = textRange.characterAttributes.textFont;

                    var fontFamily = font.family;
                    var fontName = font.name;
                    var fontStyle = font.style;

                    if (!fontStyles[fontName]) {
                        fontStyles[fontName] = fontStyle;
                    }
                }

                var message = "Font styles in layer " + layerName + ":\n";
                for (var font in fontStyles) {
                    message += font + ": " + fontStyles[font] + "\n";
                }
                throw new Error(message);
            } else {
                throw new Error("The specified layer does not contain any text frames.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to get the font styles.");
}