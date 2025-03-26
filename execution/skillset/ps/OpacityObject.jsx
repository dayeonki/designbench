if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var opacity = parseFloat(arguments[1]);

    if (layerName !== null) {
        var layer = null;

        for (var i = 0; i < doc.artLayers.length; i++) {
            if (doc.artLayers[i].name === layerName) {
                layer = doc.artLayers[i];
                break;
            }
        }

        if (layer) {
            if (!isNaN(opacity) && opacity >= 0 && opacity <= 100) {
                // Set the opacity of the layer
                layer.opacity = opacity;
            } else {
                throw new Error("Invalid opacity value. Please enter a number between 0 and 100.");
            }
        } else {
            throw new Error("No layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the opacity.");
}