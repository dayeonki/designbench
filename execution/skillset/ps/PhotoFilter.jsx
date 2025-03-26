function promptForLayerName(layerName) {
    if (layerName == null || layerName == "") {
        throw new Error("Layer with the name '" + layerName + "' does not exist.");
        return null;
    }
    return layerName;
}

function promptForFilterType(filterType) {
    var filterOptions = [
        "Warming Filter (85)", "Warming Filter (LBA)", "Warming Filter (81)",
        "Cooling Filter (80)", "Cooling Filter (LBB)", "Cooling Filter (82)",
        "Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Violet",
        "Magenta", "Sepia", "Deep Red", "Deep Blue", "Deep Emerald",
        "Deep Yellow", "Underwater", "Blue"
    ];

    if (filterType != null) {
        filterType = filterType;
    }

    if (filterType == null) {
        throw new Error("Invalid filter type provided. Please run the script again and provide a valid filter type.");
        return null;
    }
    return filterType;
}

function promptForDensity(density) {
    density = parseInt(density, 10);

    if (isNaN(density) || density < 0 || density > 100) {
        throw new Error("Invalid density value provided. Please run the script again and provide a valid density value.");
        return null;
    }
    return density;
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

function applyPhotoFilterAdjustment(filterType, density) {
    var idAdjL = stringIDToTypeID("adjustmentLayer");
    var idPhotoF = stringIDToTypeID("photoFilter");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    ref.putClass(idAdjL);
    desc.putReference(idnull, ref);
    var idUsng = charIDToTypeID("Usng");
    var desc2 = new ActionDescriptor();
    var idType = stringIDToTypeID("type");
    desc2.putClass(idType, idPhotoF);
    var idAdjs = stringIDToTypeID("adjustment");
    var list = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putString(stringIDToTypeID("name"), filterType);
    desc3.putDouble(stringIDToTypeID("density"), density);
    desc3.putBoolean(stringIDToTypeID("preserveLuminosity"), true);
    list.putObject(idPhotoF, desc3);
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

function applyPhotoFilterToLayer(layerName, filterType, density) {
    // Get the layer name from the user
    layerName = promptForLayerName(layerName);
    if (layerName == null) {
        return; // Exit the function if no valid layer name was provided
    }

    // Get the filter type from the user
    filterType = promptForFilterType(filterType);
    if (filterType == null) {
        return; // Exit the function if no valid filter type was provided
    }

    // Get the density value from the user
    density = promptForDensity(density);
    if (density == null) {
        return; // Exit the function if no valid density value was provided
    }

    // Select the layer by name
    selectLayerByName(layerName);

    // Apply Photo Filter adjustment via adjustment layer
    applyPhotoFilterAdjustment(filterType, density);

    // Clip the adjustment layer to the specified layer
    clipAdjustmentLayerToLayer();
}

// Example call to the script with arguments
// var args = ["cat", "Warming Filter (85)", 20]; // Replace with your actual arguments
var args = [arguments[0], arguments[1], parseInt(arguments[2])]
applyPhotoFilterToLayer.apply(null, args);