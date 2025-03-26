if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var angle = parseFloat(arguments[1]);

    if (layerName !== null) {
        var layer = doc.layers.itemByName(layerName);

        if (layer.isValid) {

            if (!isNaN(angle)) {
                rotateLayerObjects(layer, angle);
            } else {
                throw new Error("Invalid angle value. Please enter a number.");
            }
        } else {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");}


function rotateLayerObjects(layer, angle) {
    var objects = layer.pageItems;

    for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        obj.rotationAngle += angle;
    }
}}