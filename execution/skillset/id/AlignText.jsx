if (app.documents.length > 0) {
    var doc = app.activeDocument;
    
    var layerName = arguments[0];
    var alignment = arguments[1].toLowerCase();

    if (alignment !== "left" && alignment !== "center" && alignment !== "right") {
        throw new Error("Invalid alignment option. Please enter 'left', 'center', or 'right'.");
    } else if (layerName !== null) {
        var foundLayer = false;

        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];

            if (layer.name === layerName) {
                foundLayer = true;

                for (var j = 0; j < layer.textFrames.length; j++) {
                    var textFrame = layer.textFrames[j];
                    var text = textFrame.texts.item(0);

                    // Apply alignment based on user input
                    if (alignment === "left") {
                        text.justification = Justification.LEFT_ALIGN;
                    } else if (alignment === "center") {
                        text.justification = Justification.CENTER_ALIGN;
                    } else if (alignment === "right") {
                        text.justification = Justification.RIGHT_ALIGN;
                    }
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
    throw new Error("No open document. Please open a document to align the text.");
}