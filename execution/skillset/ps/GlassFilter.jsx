if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var distortion = parseFloat(arguments[1]);
    var smoothness = parseFloat(arguments[2]);
    var scaling = parseFloat(arguments[3]);

    if (layerName !== null && !isNaN(distortion) && !isNaN(smoothness) && !isNaN(scaling)) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            selectLayerByName(layerName);
            applyGlassEffect(layer, distortion, smoothness, scaling);
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

function applyGlassEffect(layer, distortion, smoothness, scaling) {
    // Ensure the layer is active
    doc.activeLayer = layer;

    // Apply the Glass effect filter
    var idGlass = stringIDToTypeID("glass");
    var desc = new ActionDescriptor();
    desc.putUnitDouble(stringIDToTypeID("distortion"), charIDToTypeID("#Pxl"), distortion); // Distortion
    desc.putUnitDouble(stringIDToTypeID("smoothness"), charIDToTypeID("#Pxl"), smoothness); // Smoothness
    desc.putUnitDouble(stringIDToTypeID("scaling"), charIDToTypeID("#Prc"), scaling); // Scaling
    executeAction(idGlass, desc, DialogModes.NO);
}