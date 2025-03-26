if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt the user for the layer name
    var layerName = arguments[0];
    
    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.itemByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer && layer.isValid) {
            // Loop through page items in the specified layer and remove them
            var pageItems = layer.pageItems;
            for (var i = pageItems.length - 1; i >= 0; i--) {
                pageItems[i].remove();
            }
        } else {
            throw new Error("No valid layer found. Operation cancelled.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to remove objects.");
}