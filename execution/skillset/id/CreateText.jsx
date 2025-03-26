if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var textString = arguments[1];
    
    if (layerName !== null && textString !== null) {
        // Check if the layer already exists, if not, create a new layer
        var layer;
        try {
            layer = doc.layers.item(layerName);
            var layerNameCheck = layer.name; // This will throw an error if the layer doesn't exist
        } catch (e) {
            layer = doc.layers.add({name: layerName});
        }

        // Ensure the correct measurement units
        var top = 100;   // Top position in points
        var left = -90;   // Left position in points
        var bottom = 200; // Bottom position in points
        var right = 300;  // Right position in points

        // Add a new text frame at the specified position
        var textFrame = doc.pages[0].textFrames.add({
            geometricBounds: [top, left, bottom, right], // [top, left, bottom, right] in points
            contents: textString
        });

        // Set the text frame to the specified layer
        textFrame.itemLayer = layer;

        // Set font size and name
        var text = textFrame.texts.item(0);
        text.appliedFont = "Arial";
        text.pointSize = 24;

        // Set text alignment
        text.justification = Justification.CENTER_ALIGN; // Center align the text
    } else {
        throw new Error("No layer name or text provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add text.");
}