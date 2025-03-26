if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (isNaN(posX) || isNaN(posY)) {
        throw new Error("Invalid position values entered. Please enter valid numbers for X and Y positions.");
    } else if (layerName !== null) {
        var foundLayer = false;

        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];

            if (layer.name === layerName) {
                foundLayer = true;

                for (var j = 0; j < layer.textFrames.length; j++) {
                    var textFrame = layer.textFrames[j];

                    // Reposition the text frame
                    var bounds = textFrame.geometricBounds;
                    var width = bounds[3] - bounds[1]; // Calculate width
                    var height = bounds[2] - bounds[0]; // Calculate height

                    textFrame.geometricBounds = [posY, posX, posY + height, posX + width];
                }

                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No text layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to reposition the text layer.");
}
