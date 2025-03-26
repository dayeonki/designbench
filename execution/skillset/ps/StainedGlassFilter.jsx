if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var cellSize = parseFloat(arguments[1]);
    var borderThickness = parseFloat(arguments[2]);
    var lightIntensity = parseFloat(arguments[3]);

    if (layerName !== null && !isNaN(cellSize) && !isNaN(borderThickness) && !isNaN(lightIntensity)) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            selectLayerByName(layerName);
            applyStainedGlassEffect(layer, cellSize, borderThickness, lightIntensity);
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

function applyStainedGlassEffect(layer, cellSize, borderThickness, lightIntensity) {
    // Ensure the layer is active
    doc.activeLayer = layer;

    // Apply the Stained Glass effect filter
    var idStainedGlass = stringIDToTypeID("stainedGlass");
    var desc = new ActionDescriptor();
    desc.putInteger(charIDToTypeID("ClSz"), cellSize); // Cell Size
    desc.putInteger(charIDToTypeID("BrTh"), borderThickness); // Border Thickness
    desc.putInteger(charIDToTypeID("Intn"), lightIntensity); // Light Intensity
    executeAction(idStainedGlass, desc, DialogModes.NO);
}