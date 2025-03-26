if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var posX = parseFloat(arguments[1]);
    var posY = parseFloat(arguments[2]);

    if (layerName) {
        try {
            selectLayerByName(layerName);
            
            if (!isNaN(posX) && !isNaN(posY)) {
                repositionLayer(app.activeDocument.activeLayer, posX, posY);
            } else {
                throw new Error("Invalid position entered.");
            }
        } catch (e) {
            throw new Error("No layer found with the name " + layerName);
        }
    } else {
        throw new Error("No layer name entered. Repositioning cancelled.");
    }
} else {
    throw new Error("No active document to reposition the layer in.");
}

function selectLayerByName(layerName) {
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), layerName);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref);
    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
}

function repositionLayer(layer, posX, posY) {
    var bounds = layer.bounds;
    var currentX = bounds[0].as("px");
    var currentY = bounds[1].as("px");

    var offsetX = posX - currentX;
    var offsetY = posY - currentY;

    layer.translate(offsetX, offsetY);
}