if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    
    if (layerName) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            if (layer.pageItems.length > 0) {
                removeObjectsFromLayer(layer);
            } else {
                throw new Error("The specified layer is empty.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to remove objects.");
}

function removeObjectsFromLayer(layer) {
    while (layer.pageItems.length > 0) {
        layer.pageItems[0].remove();
    }
}