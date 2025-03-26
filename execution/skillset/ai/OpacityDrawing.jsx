if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var opacity = parseFloat(arguments[1]);

    if (layerName) {
        var layer = doc.layers.getByName(layerName);

        if (layer && layer.pathItems.length > 0) {
            if (!isNaN(opacity) && opacity >= 0 && opacity <= 100) {
                changeOpacity(layer.pathItems, opacity);
            } else {
                throw new Error("Invalid opacity value entered. It must be between 0 and 100.");
            }
        } else {
            throw new Error("No path items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Opacity change cancelled.");
    }
} else {
    throw new Error("No active document to change the opacity.");
}

function changeOpacity(items, opacity) {
    for (var i = 0; i < items.length; i++) {
        items[i].opacity = opacity;
    }
}