if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var graininess = parseFloat(arguments[1]);
    var glowAmount = parseFloat(arguments[2]);
    var clearAmount = parseFloat(arguments[3]);

    if (layerName !== null && !isNaN(graininess) && !isNaN(glowAmount) && !isNaN(clearAmount)) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            selectLayerByName(layerName);
            applyDiffuseGlow(layer, graininess, glowAmount, clearAmount);
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

function applyDiffuseGlow(layer, graininess, glowAmount, clearAmount) {
    // Ensure the layer is active
    doc.activeLayer = layer;

    // Apply the Diffuse Glow filter
    layer.applyDiffuseGlow(graininess, glowAmount, clearAmount);
}