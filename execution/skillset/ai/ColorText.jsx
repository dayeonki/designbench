if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var red = parseInt(arguments[1]);
    var green = parseInt(arguments[2]);
    var blue = parseInt(arguments[3]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {
            if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
                if (red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255) {
                    var color = new RGBColor();
                    color.red = red;
                    color.green = green;
                    color.blue = blue;

                    for (var i = 0; i < layer.textFrames.length; i++) {
                        var textFrame = layer.textFrames[i];
                        var textRange = textFrame.textRange;
                        textRange.characterAttributes.fillColor = color;
                    }
                } else {
                    throw new Error("Invalid RGB values provided. Each value must be between 0 and 255.");
                }
            } else {
                throw new Error("Invalid RGB values provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the text color.");
}