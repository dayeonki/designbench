if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt for layer name and color
    var layerName = arguments[0];
    var red = parseInt(arguments[1]);
    var green = parseInt(arguments[2]);
    var blue = parseInt(arguments[3]);

    // Validate RGB input
    if (isNaN(red) || isNaN(green) || isNaN(blue) ||
        red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
        throw new Error("Invalid RGB values entered. Please enter values between 0 and 255.");
    } else if (layerName !== null) {
        var layers = doc.artLayers;
        var foundLayer = false;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.name === layerName) {
                foundLayer = true;

                // Create a new SolidColor object
                var solidColor = new SolidColor();
                solidColor.rgb.red = red;
                solidColor.rgb.green = green;
                solidColor.rgb.blue = blue;

                // Change color based on layer type
                if (layer.kind === LayerKind.TEXT) {
                    // For text layers
                    var textItem = layer.textItem;
                    textItem.color = solidColor;
                } else {
                    // For non-text layers
                    doc.activeLayer = layer;
                    app.activeDocument.selection.selectAll();
                    app.activeDocument.selection.fill(solidColor);
                    app.activeDocument.selection.deselect();
                }
                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the color.");
}