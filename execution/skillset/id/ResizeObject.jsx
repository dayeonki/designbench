if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var width = parseFloat(arguments[1]);
    var height = parseFloat(arguments[2]);

    if (layerName) {
        var layer = doc.layers.itemByName(layerName);
        
        if (layer.isValid) {

            if (!isNaN(width) && !isNaN(height)) {
                resizeLayerObjects(layer, width, height);
            } else {
                throw new Error("Invalid width or height entered.");
            }
        } else {
            throw new Error("No layer found with the name " + layerName);
        }
    } else {
        throw new Error("No layer name entered. Resizing cancelled.");
    }
} else {
    throw new Error("No active document to resize the image in.");
}

function resizeLayerObjects(layer, targetWidth, targetHeight) {
    var objects = layer.allPageItems;

    for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        var bounds = obj.geometricBounds;
        var objWidth = bounds[3] - bounds[1];
        var objHeight = bounds[2] - bounds[0];

        var scaleX = (targetWidth / objWidth) * 100;
        var scaleY = (targetHeight / objHeight) * 100;

        obj.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.MULTIPLYING_CURRENT_DIMENSIONS_BY, [scaleX / 100, scaleY / 100]);
    }
}
