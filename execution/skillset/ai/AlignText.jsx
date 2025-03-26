if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var alignment = arguments[1];
    
    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {

            if (alignment !== null) {
                var textAlign;
                switch (alignment.toLowerCase()) {
                    case "left":
                        textAlign = Justification.LEFT;
                        break;
                    case "center":
                        textAlign = Justification.CENTER;
                        break;
                    case "right":
                        textAlign = Justification.RIGHT;
                        break;
                    default:
                        throw new Error("Invalid alignment value provided. Use 'left', 'center', or 'right'.");
                        textAlign = null;
                }

                if (textAlign !== null) {
                    for (var i = 0; i < layer.textFrames.length; i++) {
                        var textFrame = layer.textFrames[i];
                        var textRange = textFrame.textRange;
                        textRange.paragraphAttributes.justification = textAlign;
                    }
                }
            } else {
                throw new Error("No alignment value provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the text alignment.");
}