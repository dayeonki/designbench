if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var textString = arguments[1];

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            layer = doc.layers.add();
            layer.name = layerName;
        }

        if (textString !== null) {
            var fontSize = 30;
            var fontName = "ArialMT"; 

            var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
            var artboardRect = artboard.artboardRect;
            var artboardWidth = artboardRect[2] - artboardRect[0];
            var artboardHeight = artboardRect[1] - artboardRect[3];
            var xPos = artboardRect[0] + artboardWidth / 2;
            var yPos = artboardRect[1] - artboardHeight / 2;

            var textFrame = layer.textFrames.add();
            textFrame.contents = textString;

            var textRange = textFrame.textRange;
            textRange.characterAttributes.size = fontSize;
            textRange.characterAttributes.textFont = app.textFonts.getByName(fontName);

            textFrame.left = xPos - textFrame.width / 2;
            textFrame.top = yPos + textFrame.height / 2;
        } else {
            throw new Error("No text input provided. Operation cancelled.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add text.");
}