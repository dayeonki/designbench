if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];

    if (layerName) {
        var layer = doc.layers.getByName(layerName);

        if (layer && layer.pathItems.length > 0) {
            removeAllPathItems(layer.pathItems);
        } else {
            throw new Error("No path items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Removal cancelled.");
    }
} else {
    throw new Error("No active document to remove the drawing from.");
}

function removeAllPathItems(items) {
    while (items.length > 0) {
        items[0].remove();
    }
}