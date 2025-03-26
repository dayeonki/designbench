function promptForLayerName() {
    var layerName = arguments[0];
    
    if (layerName == null || layerName == "") {
        throw new Error("Layer with the name '" + layerName + "' does not exist.");
        return null;
    }
    return layerName;
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

function applyBlackAndWhiteAdjustment() {
    var idAdjL = stringIDToTypeID("adjustmentLayer");
    var idBWCn = stringIDToTypeID("blackAndWhite");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    ref.putClass(idAdjL);
    desc.putReference(idnull, ref);
    var idUsng = charIDToTypeID("Usng");
    var desc2 = new ActionDescriptor();
    var idType = stringIDToTypeID("type");
    desc2.putClass(idType, idBWCn);
    var idAdjs = stringIDToTypeID("adjustment");
    var list = new ActionList();
    var desc3 = new ActionDescriptor();
    list.putObject(idBWCn, desc3);
    desc2.putList(idAdjs, list);
    desc.putObject(idUsng, idAdjL, desc2);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
}

function clipAdjustmentLayerToLayer() {
    var idGrpL = stringIDToTypeID("groupEvent");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putEnumerated(idLyr, charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    executeAction(idGrpL, desc, DialogModes.NO);
}

function convertLayerToBlackAndWhite() {
    if (!layerExists(layerName)) {
        throw new Error("Layer with the name '" + layerName + "' does not exist.");
        return; // Exit the function if no valid layer name was provided
    }
    
    // Get the layer name from the user
    var layerName = promptForLayerName();
    if (layerName == null) {
        return; // Exit the function if no valid layer name was provided
    }

    // Select the layer by name
    selectLayerByName(layerName);

    // Apply Black and White adjustment via adjustment layer
    applyBlackAndWhiteAdjustment();

    // Clip the adjustment layer to the specified layer
    clipAdjustmentLayerToLayer();
}

convertLayerToBlackAndWhite();