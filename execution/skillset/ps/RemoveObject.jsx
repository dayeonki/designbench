if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    
    if (layerName !== null) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            layer.remove();
        } else {
            throw new Error("No valid layer found. Operation cancelled.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to remove a layer.");
}