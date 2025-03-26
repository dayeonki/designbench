if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var red = parseInt(arguments[1]);
    var green = parseInt(arguments[2]);
    var blue = parseInt(arguments[3]);

    // Validate RGB input
    if (isNaN(red) || isNaN(green) || isNaN(blue) || red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
        throw new Error("Invalid RGB values entered. Please enter values between 0 and 255.");
    } else if (layerName !== null) {
        var foundLayer = false;

        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];

            if (layer.name === layerName) {
                foundLayer = true;

                // Create a new color swatch
                var color = doc.colors.add();
                color.properties = {
                    name: "CustomColor",
                    model: ColorModel.process,
                    space: ColorSpace.RGB,
                    colorValue: [red, green, blue]
                };

                for (var j = 0; j < layer.textFrames.length; j++) {
                    var textFrame = layer.textFrames[j];
                    var text = textFrame.texts.item(0);

                    // Apply the color to the text
                    text.fillColor = color;
                }

                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified layer name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the color.");
}