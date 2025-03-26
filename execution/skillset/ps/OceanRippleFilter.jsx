if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var rippleSize = parseFloat(arguments[1]);
    var rippleMagnitude = parseFloat(arguments[2]);

    if (layerName !== null && !isNaN(rippleSize) && !isNaN(rippleMagnitude)) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            selectLayerByName(layerName);
            applyOceanRipple(layer, rippleSize, rippleMagnitude);
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

function applyOceanRipple(layer, size, magnitude) {
    // Ensure the layer is active
    doc.activeLayer = layer;

    // Apply the Ocean Ripple filter
    var idOceanRipple = stringIDToTypeID("oceanRipple");
    var desc = new ActionDescriptor();
    desc.putUnitDouble(stringIDToTypeID("size"), charIDToTypeID("#Pxl"), size);
    desc.putUnitDouble(stringIDToTypeID("magnitude"), charIDToTypeID("#Prc"), magnitude);
    executeAction(idOceanRipple, desc, DialogModes.NO);
}