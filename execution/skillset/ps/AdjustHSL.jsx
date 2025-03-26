function promptForLayerName(layerName) {
    if (layerName == null || layerName == "") {
        throw new Error("Layer with the name '" + layerName + "' does not exist.");
        return null;
    }
    return layerName;
}

function promptForAdjustmentValues(hue, saturation, light) {
    hue = parseInt(hue, 10);
    saturation = parseInt(saturation, 10);
    light = parseInt(light, 10);

    if (isNaN(hue) || isNaN(saturation) || isNaN(light)) {
        throw new Error("Invalid input provided. Please run the script again and provide valid numbers.");
        return null;
    }
    return { hue: hue, sat: saturation, light: light };
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

function layerExists(layerName) {
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), layerName);
    try {
        var desc = executeActionGet(ref);
        return true;
    } catch (e) {
        return false;
    }
}

function HueSatLight(layerName, hue, saturation, light) {
    // Check if the layer exists before attempting to select it
    if (!layerExists(layerName)) {
        throw new Error("Layer with the name '" + layerName + "' does not exist.");
        return; // Exit the function if no valid layer name was provided
    }

    // Get the adjustment values from the arguments
    var adjustments = promptForAdjustmentValues(hue, saturation, light);
    if (adjustments == null) {
        return; // Exit the function if no valid adjustment values were provided
    }

    // Select the layer by name
    selectLayerByName(layerName);

    var desc9 = new ActionDescriptor();
    desc9.putBoolean(charIDToTypeID('Clrz'), false);
    var list2 = new ActionList();
    var desc10 = new ActionDescriptor();
    desc10.putInteger(charIDToTypeID('H   '), adjustments.hue);
    desc10.putInteger(charIDToTypeID('Strt'), adjustments.sat);
    desc10.putInteger(charIDToTypeID('Lght'), adjustments.light);
    list2.putObject(charIDToTypeID('Hst2'), desc10);
    desc9.putList(charIDToTypeID('Adjs'), list2);
    executeAction(charIDToTypeID('HStr'), desc9, DialogModes.NO);
}

// Call the function with arguments
HueSatLight("BackgroundLayer", 10, 20, 10);
