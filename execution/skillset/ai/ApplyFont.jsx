// Sample font: Ayuthaya
if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var fontName = arguments[1];

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
            layerName = null;
        }

        if (layerName !== null) {

            if (fontName !== null) {
                var fontFound = true;
                for (var i = 0; i < layer.textFrames.length; i++) {
                    var textFrame = layer.textFrames[i];
                    var textRange = textFrame.textRange;

                    try {
                        textRange.characterAttributes.textFont = app.textFonts.getByName(fontName);
                    } catch (e) {
                        fontFound = false;
                        break;
                    }
                }

                if (!fontFound) {
                    throw new Error("Font not found. Please make sure the font is installed on your system.");
                }
            } else {
                throw new Error("No font name provided. Operation cancelled.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the font.");
}