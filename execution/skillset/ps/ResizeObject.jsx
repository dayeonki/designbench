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

if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var width = parseFloat(arguments[1]);
    var height = parseFloat(arguments[2]);

    if (layerName) {
        var layer = null;
        for (var i = 0; i < doc.artLayers.length; i++) {
            if (doc.artLayers[i].name === layerName) {
                layer = doc.artLayers[i];
                break;
            }
        }
        selectLayerByName(layerName);

        if (layer) {

            if (!isNaN(width) && !isNaN(height)) {
                resizeImageWithoutMoving(layer, width, height);
            } else {
                throw new Error("Invalid width or height entered.");
            }
        } else {
            throw new Error("No layer found with the name " + layerName);
        }
    } else {
        throw new Error("No layer name entered. Resizing cancelled.");
    }
} else {
    throw new Error("No active document to resize the image in.");
}

function resizeImageWithoutMoving(layer, width, height) {
    doc.activeLayer = layer;

    var bounds = layer.bounds;
    var layerWidth = bounds[2].as("px") - bounds[0].as("px");
    var layerHeight = bounds[3].as("px") - bounds[1].as("px");

    var scaleX = (width / layerWidth) * 100;
    var scaleY = (height / layerHeight) * 100;

    layer.resize(scaleX, scaleY, AnchorPosition.MIDDLECENTER);
}