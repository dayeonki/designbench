if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var opacity = parseFloat(arguments[1]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            if (!isNaN(opacity) && opacity >= 0 && opacity <= 100) {
                // Loop through objects in the specified layer and set opacity
                for (var i = 0; i < layer.pageItems.length; i++) {
                    var pageItem = layer.pageItems[i];
                    pageItem.opacity = opacity;
                }
            } else {
                throw new Error("Invalid opacity value. Please enter a number between 0 and 100.");
            }
        } else {
            throw new Error("No valid layer found. Operation cancelled.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to change the opacity.");
}