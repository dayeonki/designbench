if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var fileName = arguments[0];
    var layerName = arguments[1];

    if (fileName) {
        var filePath = fileName;
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


function placeImageInMiddle(file) {
    var layer = doc.layers.add();
    layer.name = layerName;

    var placedItem = doc.placedItems.add();
    placedItem.file = file;

    var docCenterX = doc.width / 2;
    var docCenterY = doc.height / 6;

    var placedWidth = placedItem.width;
    var placedHeight = placedItem.height;

    var posX = docCenterX - (placedWidth / 2);
    var posY = docCenterY - (placedHeight / 2);

    placedItem.position = [posX, posY];
}