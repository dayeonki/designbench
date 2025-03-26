if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var width = parseFloat(arguments[1]);
    var height = parseFloat(arguments[2]);

    if (layerName) {
        var layer = doc.layers.getByName(layerName);

        if (layer && layer.pathItems.length > 0) {

            if (!isNaN(width) && !isNaN(height)) {
                resizePathItem(layer.pathItems[0], width, height);
            } else {
                throw new Error("Invalid width or height entered.");
            }
        } else {
            throw new Error("No path items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Resizing cancelled.");
    }
} else {
    throw new Error("No active document to resize the object in.");
}

function resizePathItem(item, width, height) {
    // Resize the path item while keeping it centered
    var bounds = item.geometricBounds;
    var currentWidth = bounds[2] - bounds[0];
    var currentHeight = bounds[1] - bounds[3];

    // Calculate the scaling factors
    var widthScale = width / currentWidth;
    var heightScale = height / currentHeight;

    // Apply scaling transformation
    item.resize(widthScale * 100, heightScale * 100, undefined, undefined, undefined, undefined, undefined, Transformation.CENTER);
}