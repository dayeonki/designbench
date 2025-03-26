if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var squareSize = parseFloat(arguments[1]);
    var relief = parseFloat(arguments[2]);

    if (layerName !== null && !isNaN(squareSize) && !isNaN(relief)) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            selectLayerByName(layerName);
            applyPatchworkEffect(layer, squareSize, relief);
        } else {
            throw new Error("No layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name or valid parameters provided. Operation cancelled.");
    }
} else {
    throw new Error("No active document to apply the filter to.");
}

function selectLayerByName(layerName) {
    var idselect = charIDToTypeID("slct");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putName(idLyr, layerName);
    desc.putReference(idnull, ref);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    executeAction(idselect, desc, DialogModes.NO);
}

function applyPatchworkEffect(layer, squareSize, relief) {
    // Ensure the layer is active
    doc.activeLayer = layer;

    // Apply the Patchwork effect filter
    var idPatchwork = stringIDToTypeID("patchwork");
    var desc = new ActionDescriptor();
    desc.putInteger(stringIDToTypeID("squareSize"), squareSize); // Square Size
    desc.putInteger(stringIDToTypeID("relief"), relief); // Relief
    executeAction(idPatchwork, desc, DialogModes.NO);
}