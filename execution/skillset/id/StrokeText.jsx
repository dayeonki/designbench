if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var strokeWidth = parseFloat(arguments[1]);
    var red = parseInt(arguments[2]);
    var green = parseInt(arguments[3]);
    var blue = parseInt(arguments[4]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.itemByName(layerName);
            if (!layer.isValid) {
                throw new Error("Layer not found");
            }
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {
            if (strokeWidth !== null && !isNaN(strokeWidth)) {
                if (strokeWidth >= 0.25 && strokeWidth <= 5) {
                    if (red !== null && green !== null && blue !== null &&
                        !isNaN(red) && !isNaN(green) && !isNaN(blue)) {
                        if (red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255) {
                            for (var i = 0; i < layer.textFrames.length; i++) {
                                var textFrame = layer.textFrames[i];

                                for (var j = 0; j < textFrame.texts.length; j++) {
                                    var text = textFrame.texts[j];
                                    text.strokeWeight = strokeWidth;

                                    var strokeColor = doc.colors.add({space: ColorSpace.RGB, colorValue: [red, green, blue]});
                                    text.strokeColor = strokeColor;
                                }
                            }

                        } else {
                            throw new Error("Invalid RGB values provided. Each component must be between 0 and 255.");
                        }
                    } else {
                        throw new Error("Invalid RGB values provided. Operation cancelled.");
                    }
                } else {
                    throw new Error("Invalid stroke width value provided. It must be between 0.25 and 5 points.");
                }
            } else {
                throw new Error("Invalid stroke width value provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to adjust the text stroke.");
}
