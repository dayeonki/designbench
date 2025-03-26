if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var fileName = arguments[0];
    var layerName = arguments[1];
    
    if (fileName) {
        var filePath = fileName.replace(/[{}]/g, '');
        var imageFile = new File(filePath);

        if (imageFile.exists) {

            if (layerName) {
                placeImageInMiddle(imageFile, layerName);
            } else {
                throw new Error("No layer name entered. Layer renaming cancelled.");
            }
        } else {
            throw new Error("File " + filePath + " does not exist.");
        }
    } else {
        throw new Error("No file name entered. Import cancelled.");
    }
} else {
    throw new Error("No active document to import the image into.");
}

function placeImageInMiddle(file, layerName) {
    var idPlc = charIDToTypeID("Plc ");
    var desc2 = new ActionDescriptor();
    desc2.putPath(charIDToTypeID("null"), file);
    desc2.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
    var idOfst = charIDToTypeID("Ofst");
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), doc.width.as("px") / 2);
    desc3.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), doc.height.as("px") / 2);
    desc2.putObject(idOfst, idOfst, desc3);
    executeAction(idPlc, desc2, DialogModes.NO);

    var placedLayer = doc.activeLayer;
    placedLayer.name = layerName;

    var bounds = placedLayer.bounds;
    var layerWidth = bounds[2].as("px") - bounds[0].as("px");
    var layerHeight = bounds[3].as("px") - bounds[1].as("px");

    var offsetX = (doc.width.as("px") - layerWidth) / 2 - bounds[0].as("px");
    var offsetY = (doc.height.as("px") - layerHeight) / 2 - bounds[1].as("px");

    placedLayer.translate(offsetX, offsetY);
}