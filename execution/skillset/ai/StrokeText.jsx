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
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {
            if (!isNaN(strokeWidth) && strokeWidth >= 0.25 && strokeWidth <= 5) {
                if (!isNaN(red) && !isNaN(green) && !isNaN(blue) &&
                    red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255) {

                    for (var i = 0; i < layer.textFrames.length; i++) {
                        var textFrame = layer.textFrames[i];
                        var textRange = textFrame.textRange;
                        var characterAttributes = textRange.characterAttributes;

                        characterAttributes.strokeWeight = strokeWidth;

                        var strokeColor = new RGBColor();
                        strokeColor.red = red;
                        strokeColor.green = green;
                        strokeColor.blue = blue;
                        characterAttributes.strokeColor = strokeColor;
                    }
                } else {
                    throw new Error("Invalid RGB values provided. Each component must be between 0 and 255.");
                }
            } else {
                throw new Error("Invalid stroke width value provided. It must be between 0.25 and 5 points.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to adjust the text stroke.");
}